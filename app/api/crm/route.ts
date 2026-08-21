import { NextRequest, NextResponse } from 'next/server';
import { createLead } from '@/lib/data-store';

const CRM_API_URL = "https://connector.b2bbricks.com/api/Integration/hook/81b9c640-c7cd-494d-993a-bf20b5445856";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Also save to the local leads store so chatbot leads show in the admin
    // panel (/admin/leads), independent of the external CRM.
    try {
      const rawPhone = String(body.mobile ?? body.phone ?? '').replace(/\D/g, '');
      const phone = rawPhone.slice(-10);
      if (phone.length === 10) {
        await createLead({
          name: body.name,
          phone,
          email: body.email,
          project: body.project,
          message: body.remark,
          source: 'chatbot',
        });
      }
    } catch (leadErr) {
      console.error('⚠️ Failed to save chatbot lead to local store:', leadErr);
    }

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