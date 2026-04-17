import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
    const githubPAT = process.env.GITHUB_PAT;

    if (!supabaseUrl || !supabaseAnonKey || !githubPAT) {
      return NextResponse.json({ error: 'Server niet geconfigureerd' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      await new Promise(r => setTimeout(r, 1000));
      return NextResponse.json({ error: 'Verkeerde gegevens' }, { status: 401 });
    }

    return NextResponse.json({ token: githubPAT });
  } catch {
    return NextResponse.json({ error: 'Ongeldige aanvraag' }, { status: 400 });
  }
}
