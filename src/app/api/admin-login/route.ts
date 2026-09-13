import { NextRequest, NextResponse } from 'next/server';
import { leesBeheerders, magBinnen } from '@/lib/beheerders';

/**
 * Aanmelden op het beheer.
 *
 * Wie het juiste wachtwoord geeft, krijgt het GitHub-token van de club terug.
 * Het CMS in de browser gebruikt dat token om de inhoud in de repository te
 * lezen en te schrijven; zo hoeft geen enkel bestuurslid een GitHub-account te
 * hebben. Het token zelf staat alleen hier op de server.
 *
 * De beheerders staan in de instelling BEHEERDERS, zie lib/beheerders.ts.
 */

// node:crypto: dit hoort op de gewone server te draaien, niet aan de rand.
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
      return NextResponse.json({ error: 'Vul e-mailadres en wachtwoord in.' }, { status: 400 });
    }

    const githubPAT = process.env.GITHUB_PAT;
    const beheerders = leesBeheerders(process.env.BEHEERDERS);

    if (!githubPAT || beheerders.length === 0) {
      console.error('[admin-login] instellingen ontbreken:', {
        token: !!githubPAT,
        beheerders: beheerders.length,
      });
      return NextResponse.json(
        { error: 'Het beheer is nog niet ingesteld. Verwittig de webbeheerder.' },
        { status: 500 },
      );
    }

    if (!magBinnen(beheerders, email, password)) {
      // Bewust vaag: niet verklappen of het adres bestaat.
      return NextResponse.json({ error: 'E-mailadres of wachtwoord klopt niet.' }, { status: 401 });
    }

    console.log('[admin-login] aangemeld:', email);
    return NextResponse.json({ token: githubPAT });
  } catch {
    return NextResponse.json({ error: 'De aanvraag kon niet gelezen worden.' }, { status: 400 });
  }
}
