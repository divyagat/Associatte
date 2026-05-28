import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ZAPIER_WEBHOOK_URL = 'https://hooks.zapier.com/hooks/catch/13262817/3gs59wo/';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, email, message, projectName, trackingData } = body;
    
    // Validate required fields
    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Name and phone number are required' },
        { status: 400 }
      );
    }
    
    // Prepare data for Zapier/CRM
    const crmData = {
      name: name.trim(),
      phone: phone.trim(),
      email: email || '',
      message: message || `Interested in ${projectName}`,
      projectName: projectName || 'General Enquiry',
      source: trackingData?.source || 'website',
      campaign: trackingData?.campaign || '',
      medium: trackingData?.medium || 'organic',
      city: trackingData?.city || '',
      submittedAt: new Date().toISOString(),
      submittedDate: new Date().toLocaleDateString('en-IN'),
      submittedTime: new Date().toLocaleTimeString('en-IN'),
      userAgent: request.headers.get('user-agent') || '',
      ipAddress: request.headers.get('x-forwarded-for') || 
                 request.headers.get('x-real-ip') || 
                 'Unknown',
      pageUrl: request.headers.get('referer') || ''
    };
    
    console.log('📤 Sending to Zapier CRM:', {
      name: crmData.name,
      phone: crmData.phone,
      project: crmData.projectName,
      time: crmData.submittedTime
    });
    
    // Send to Zapier webhook
    const zapierResponse = await fetch(ZAPIER_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(crmData),
    });
    
    if (!zapierResponse.ok) {
      throw new Error(`Zapier webhook failed with status ${zapierResponse.status}`);
    }
    
    const zapierResult = await zapierResponse.text();
    console.log('✅ Successfully sent to CRM:', zapierResult);
    
    // Return success response
    return NextResponse.json(
      { 
        success: true, 
        message: 'Enquiry submitted successfully',
        data: { 
          name: crmData.name, 
          phone: crmData.phone,
          projectName: crmData.projectName
        }
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('❌ Error processing enquiry:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to submit enquiry. Please try again later.' 
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS request for CORS if needed
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