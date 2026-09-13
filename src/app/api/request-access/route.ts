import { NextRequest, NextResponse } from 'next/server';

/**
 * Iemand vraagt toegang tot het beheer.
 *
 * De aanvraag komt per mail bij de webbeheerder terecht; die maakt dan een
 * regel aan met `node scripts/beheerder.mjs` en zet ze bij de instelling
 * BEHEERDERS. Voorheen werd de aanvraag ook in Supabase bewaard, maar dat
 * project bestaat niet meer en een tweede plek om na te kijken hoefde niet.
 */

/** Zodat een naam met < of & de mail niet kan verbouwen. */
function veilig(tekst: string): string {
  return tekst
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function POST(request: NextRequest) {
  try {
    const { naam, email, bericht } = await request.json();

    if (typeof naam !== 'string' || typeof email !== 'string' || !naam.trim() || !email.trim()) {
      return NextResponse.json({ error: 'Naam en e-mailadres zijn verplicht' }, { status: 400 });
    }

    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) {
      console.error('[request-access] RESEND_API_KEY ontbreekt, aanvraag van', email, 'niet verstuurd');
      return NextResponse.json({ error: 'De aanvraag kon niet verstuurd worden.' }, { status: 500 });
    }

    const antwoord = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${resendKey}`,
      },
      body: JSON.stringify({
        from: 'KWS Linkhout beheer <noreply@kwslinkhout.be>',
        to: 'jochen.thoelen@gmail.com',
        subject: `Toegang tot het beheer aangevraagd door ${naam}`,
        html: `<h2>Nieuwe aanvraag voor het beheer</h2>
            <p><strong>Naam:</strong> ${veilig(naam)}</p>
            <p><strong>E-mail:</strong> ${veilig(email)}</p>
            ${bericht ? `<p><strong>Bericht:</strong> ${veilig(String(bericht))}</p>` : ''}
            <hr>
            <p style="color:#666;font-size:12px">Toegang geven: draai
              <code>node scripts/beheerder.mjs "${veilig(email)}" "een wachtwoord"</code>
              en plak de regel bij de instelling BEHEERDERS in Vercel.
            </p>`,
      }),
    });

    if (!antwoord.ok) {
      console.error('[request-access] Resend gaf', antwoord.status);
      return NextResponse.json({ error: 'De aanvraag kon niet verstuurd worden.' }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('[request-access] fout:', e);
    return NextResponse.json({ error: 'Er ging iets mis' }, { status: 500 });
  }
}
