// app/api/enquiry/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const B2BBRICKS_WEBHOOK_URL = 'https://connector.b2bbricks.com/api/Integration/hook/43d25585-78eb-4866-85d8-ef77d6dedb4e';

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
    
    // Prepare data for B2B Bricks
    const b2bData = {
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
    
    console.log('📤 Sending to B2B Bricks:', {
      name: b2bData.name,
      phone: b2bData.phone,
      project: b2bData.projectName,
      time: b2bData.submittedTime
    });
    
    // Send to B2B Bricks webhook
    const response = await fetch(B2BBRICKS_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(b2bData),
    });
    
    if (!response.ok) {
      throw new Error(`B2B Bricks webhook failed with status ${response.status}`);
    }
    
    const result = await response.text();
    console.log('✅ Successfully sent to B2B Bricks:', result);
    
    // Return success response
    return NextResponse.json(
      { 
        success: true, 
        message: 'Enquiry submitted successfully',
        data: { 
          name: b2bData.name, 
          phone: b2bData.phone,
          projectName: b2bData.projectName
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