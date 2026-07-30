import { NextRequest, NextResponse } from 'next/server';

const CRM_API_URL = "https://connector.b2bbricks.com/api/Integration/hook/43d25585-78eb-4866-85d8-ef77d6dedb4e";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const response = await fetch(CRM_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
    });

    return NextResponse.json(
      { success: response.ok },
      { status: response.status }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to send to CRM" },
      { status: 500 }
    );
  }
}