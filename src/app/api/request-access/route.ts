import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { naam, email, bericht } = await request.json();

    if (!naam || !email) {
      return NextResponse.json({ error: 'Naam en e-mail zijn verplicht' }, { status: 400 });
    }

    // Stuur notificatie via e-mail (mailto-gebaseerde fallback via fetch naar eigen endpoint)
    // Gebruik Supabase service role om een notificatie op te slaan
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && supabaseServiceKey) {
      // Sla aanvraag op in Supabase tabel access_requests
      await fetch(`${supabaseUrl}/rest/v1/access_requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({ naam, email, bericht: bericht || null }),
      });
    }

    // Stuur notificatie-mail via Resend als de key beschikbaar is
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          from: 'KWS Linkhout CMS <noreply@kwslinkhout.be>',
          to: 'jochen.thoelen@gmail.com',
          subject: `CMS toegang aangevraagd door ${naam}`,
          html: `<h2>Nieuwe CMS toegangsaanvraag</h2>
            <p><strong>Naam:</strong> ${naam}</p>
            <p><strong>E-mail:</strong> ${email}</p>
            ${bericht ? `<p><strong>Bericht:</strong> ${bericht}</p>` : ''}
            <hr>
            <p style="color:#666;font-size:12px">Maak een account aan via
              <a href="https://supabase.com/dashboard/project/fdrouwidzuaavmhcegvk/auth/users">Supabase → Authentication → Users</a>
            </p>`,
        }),
      });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('[request-access] fout:', e);
    return NextResponse.json({ error: 'Er ging iets mis' }, { status: 500 });
  }
}
