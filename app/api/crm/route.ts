import { NextRequest, NextResponse } from 'next/server';
import { createLead } from '@/lib/data-store';

const CRM_API_URL = "https://connector.b2bbricks.com/api/Integration/hook/81b9c640-c7cd-494d-993a-bf20b5445856";

// Expedify CRM Webhook URL — data is sent here in addition to B2B Bricks
const EXPEDIFY_WEBHOOK_URL = "https://api.expedify.ai/hooks/434ada7c-5990-4f75-8e7d-d81c60e8ce92/lead-form-submission-associatte?secret=whsec_in_oh5x9ZIRsZOCx0YUNccPYxffpRs7H8mN4NYurAqKN8Y";

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

    // Send to both CRMs in parallel — one failing must not block the other.
    const [b2bResult, expedifyResult] = await Promise.allSettled([
      fetch(CRM_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(body),
      }),
      fetch(EXPEDIFY_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(body),
      }),
    ]);

    if (b2bResult.status === 'rejected') {
      console.error('❌ B2B Bricks request failed:', b2bResult.reason);
    }
    if (expedifyResult.status === 'rejected') {
      console.error('❌ Expedify request failed:', expedifyResult.reason);
    }

    const b2bOk = b2bResult.status === 'fulfilled' && b2bResult.value.ok;
    const expedifyOk = expedifyResult.status === 'fulfilled' && expedifyResult.value.ok;

    // Success if at least one CRM accepted the lead.
    return NextResponse.json(
      { success: b2bOk || expedifyOk },
      { status: b2bOk || expedifyOk ? 200 : 502 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to send to CRM" },
      { status: 500 }
    );
  }
}