import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
    const githubPAT = process.env.GITHUB_PAT;

    if (!supabaseUrl || !supabaseAnonKey || !githubPAT) {
      console.error('[admin-login] ontbrekende env vars:', { supabaseUrl: !!supabaseUrl, supabaseAnonKey: !!supabaseAnonKey, githubPAT: !!githubPAT });
      return NextResponse.json({ error: 'Server niet geconfigureerd' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      console.error('[admin-login] Supabase fout:', error.message, error.status);
      await new Promise(r => setTimeout(r, 1000));
      return NextResponse.json({ error: 'Verkeerde gegevens' }, { status: 401 });
    }

    console.log('[admin-login] login gelukt voor:', data.user?.email);
    return NextResponse.json({ token: githubPAT });
  } catch (e) {
    console.error('[admin-login] onverwachte fout:', e);
    return NextResponse.json({ error: 'Ongeldige aanvraag' }, { status: 400 });
  }
}
