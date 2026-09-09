import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createLead } from "@/lib/data-store";

// Your B2B Bricks Webhook URL
const B2BBRICKS_WEBHOOK_URL = 'https://connector.b2bbricks.com/api/Integration/hook/81b9c640-c7cd-494d-993a-bf20b5445856';

// Expedify CRM Webhook URL — data is sent here in addition to B2B Bricks
const EXPEDIFY_WEBHOOK_URL = 'https://api.expedify.ai/hooks/434ada7c-5990-4f75-8e7d-d81c60e8ce92/lead-form-submission-associatte?secret=whsec_in_oh5x9ZIRsZOCx0YUNccPYxffpRs7H8mN4NYurAqKN8Y';

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  const trueClientIp = request.headers.get('true-client-ip');
  
  if (forwardedFor) return forwardedFor.split(',')[0].trim();
  if (realIp) return realIp;
  if (cfConnectingIp) return cfConnectingIp;
  if (trueClientIp) return trueClientIp;
  
  return 'Unknown';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Extract fields - handle multiple possible field names
    const name = body.name || body.fullName || '';
    const phone = body.phone || body.mobile || body.phoneNumber || '';
    const email = body.email || '';
    const project = body.project || body.projectName || body.projectId || 'General Enquiry';
    const remark = body.remark || body.message || '';
    
    // Additional fields from property page
    const projectImage = body.projectImage || '';
    const projectLocation = body.projectLocation || '';
    const projectPrice = body.projectPrice || '';
    const developer = body.developer || '';
    const source = body.source || 'associatte_website'; // Changed to associatte
    const campaign = body.campaign || '';
    const city = body.city || '';
    
    // Validate required fields
    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Name and phone number are required' },
        { status: 400 }
      );
    }
    
    // Extract ONLY the last 10 digits from mobile number
    const mobileNumber = phone.trim();
    const digitsOnly = mobileNumber.replace(/\D/g, '');
    const last10Digits = digitsOnly.slice(-10);
    
    if (last10Digits.length !== 10) {
      return NextResponse.json(
        { error: 'Invalid mobile number. Please enter a valid 10-digit number.' },
        { status: 400 }
      );
    }
    
    // Build enhanced remark with project details
    let enhancedRemark = remark;
    if (projectImage || projectLocation || projectPrice || developer) {
      enhancedRemark = `${remark}\n\n📋 Project Details:\n`;
      if (project) enhancedRemark += `• Project: ${project}\n`;
      if (developer) enhancedRemark += `• Builder: ${developer}\n`;
      if (projectLocation) enhancedRemark += `• Location: ${typeof projectLocation === 'object' ? `${projectLocation.area}, ${projectLocation.city}` : projectLocation}\n`;
      if (projectPrice) enhancedRemark += `• Price: ${projectPrice}\n`;
      if (city) enhancedRemark += `• City: ${city}\n`;
      enhancedRemark += `• Source: Associatte Website${campaign ? ` (${campaign})` : ''}\n`;
      enhancedRemark += `• IP: ${getClientIp(request)}`;
    } else {
      enhancedRemark = `${remark || 'Associatte Website Enquiry'} | IP: ${getClientIp(request)}`;
    }
    
    // Prepare data for CRM
    const crmData = {
      name: name.trim(),
      mobile: last10Digits,
      email: email.trim(),
      project: project,
      remark: enhancedRemark
    };
    
    // Also save to the local leads store so it shows in the admin panel
    // (/admin/leads), independent of the external CRM.
    try {
      await createLead({
        name: crmData.name,
        phone: last10Digits,
        email: crmData.email,
        project: project,
        message: remark,
        source: source || 'contact_us',
      });
    } catch (leadErr) {
      console.error('⚠️ Failed to save enquiry to local leads store:', leadErr);
    }

    console.log('📤 Sending to B2B Bricks CRM from Associatte:', {
      name: crmData.name,
      mobile: crmData.mobile,
      mobileLength: crmData.mobile.length,
      project: crmData.project,
      hasEmail: !!crmData.email
    });
    
    // Send to both CRMs in parallel — one failing must not block the other.
    const [b2bResult, expedifyResult] = await Promise.allSettled([
      fetch(B2BBRICKS_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(crmData),
      }),
      fetch(EXPEDIFY_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(crmData),
      }),
    ]);

    // B2B Bricks result
    if (b2bResult.status === 'fulfilled') {
      const response = b2bResult.value;
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ B2B Bricks error response:', errorText);
      } else {
        const result = await response.text();
        console.log('✅ Successfully sent to B2B Bricks CRM from Associatte:', result);
      }
    } else {
      console.error('❌ B2B Bricks request failed:', b2bResult.reason);
    }

    // Expedify result
    if (expedifyResult.status === 'fulfilled') {
      const response = expedifyResult.value;
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Expedify error response:', errorText);
      } else {
        const result = await response.text();
        console.log('✅ Successfully sent to Expedify CRM from Associatte:', result);
      }
    } else {
      console.error('❌ Expedify request failed:', expedifyResult.reason);
    }

    // Consider the submission successful if at least one CRM accepted it.
    const b2bOk = b2bResult.status === 'fulfilled' && b2bResult.value.ok;
    const expedifyOk = expedifyResult.status === 'fulfilled' && expedifyResult.value.ok;
    if (!b2bOk && !expedifyOk) {
      throw new Error('Both CRM webhooks failed');
    }
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Enquiry submitted successfully',
        data: { 
          name: crmData.name, 
          mobile: crmData.mobile,
          project: crmData.project
        }
      },
      { status: 200 }
    );
    
  } catch (error: any) {
    console.error('❌ Error sending to B2B Bricks from Associatte:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to submit enquiry. Please try again later.' 
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}