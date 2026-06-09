import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Your B2B Bricks Webhook URL
const B2BBRICKS_WEBHOOK_URL = 'https://connector.b2bbricks.com/api/Integration/hook/81b9c640-c7cd-494d-993a-bf20b5445856';

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
    let mobileNumber = phone.trim();
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
    
    console.log('📤 Sending to B2B Bricks CRM from Associatte:', {
      name: crmData.name,
      mobile: crmData.mobile,
      mobileLength: crmData.mobile.length,
      project: crmData.project,
      hasEmail: !!crmData.email
    });
    
    // Send to B2B Bricks webhook
    const response = await fetch(B2BBRICKS_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(crmData),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ B2B Bricks error response:', errorText);
      throw new Error(`B2B Bricks webhook failed with status ${response.status}`);
    }
    
    const result = await response.text();
    console.log('✅ Successfully sent to B2B Bricks CRM from Associatte:', result);
    
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