import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

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
    const { name, phone, email, project, remark } = body;
    
    // Validate required fields
    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Name and phone number are required' },
        { status: 400 }
      );
    }
    
    // Extract ONLY the last 10 digits from mobile number
    let mobileNumber = phone.trim();
    // Remove any non-digit characters (+, spaces, -, etc.)
    const digitsOnly = mobileNumber.replace(/\D/g, '');
    // Get the last 10 digits (handles cases with country code)
    const last10Digits = digitsOnly.slice(-10);
    
    // Validate that we have exactly 10 digits
    if (last10Digits.length !== 10) {
      return NextResponse.json(
        { error: 'Invalid mobile number. Please enter a valid 10-digit number.' },
        { status: 400 }
      );
    }
    
    // Prepare data for CRM - mobile field only contains 10-digit number
    const crmData = {
      name: name.trim(),
      mobile: last10Digits, // ONLY 10-digit number (e.g., "8228377777")
      email: email || '',
      project: project || 'General Enquiry',
      remark: remark || `Website Enquiry | IP: ${getClientIp(request)}`
    };
    
    console.log('📤 Sending to B2B Bricks CRM:', {
      name: crmData.name,
      mobile: crmData.mobile,
      mobileLength: crmData.mobile.length,
      project: crmData.project,
      remark: crmData.remark
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
    console.log('✅ Successfully sent to B2B Bricks CRM:', result);
    
    // Return success response
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
    
  } catch (error) {
    console.error('❌ Error sending to B2B Bricks:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to submit enquiry. Please try again later.' 
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