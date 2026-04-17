import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: NextRequest) {
  try {
    const { naam, email, bericht } = await request.json();

    if (!naam || !email) {
      return NextResponse.json({ error: 'Naam en e-mail zijn verplicht' }, { status: 400 });
    }

    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) {
      return NextResponse.json({ error: 'E-mail niet geconfigureerd' }, { status: 500 });
    }

    const resend = new Resend(resendKey);

    await resend.emails.send({
      from: 'KWS Linkhout CMS <noreply@kwslinkhout.be>',
      to: 'jochen.thoelen@gmail.com',
      subject: `CMS toegang aangevraagd door ${naam}`,
      html: `
        <h2>Nieuwe CMS toegangsaanvraag</h2>
        <p><strong>Naam:</strong> ${naam}</p>
        <p><strong>E-mail:</strong> ${email}</p>
        ${bericht ? `<p><strong>Bericht:</strong> ${bericht}</p>` : ''}
        <hr>
        <p style="color:#666;font-size:12px">
          Maak een account aan via 
          <a href="https://supabase.com/dashboard/project/fdrouwidzuaavmhcegvk/auth/users">
            Supabase → Authentication → Users
          </a>
        </p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Er ging iets mis' }, { status: 500 });
  }
}
