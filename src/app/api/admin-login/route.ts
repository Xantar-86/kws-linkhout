import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
    const githubPAT = process.env.GITHUB_PAT;

    if (!supabaseUrl || !supabaseAnonKey || !githubPAT) {
      return NextResponse.json({ error: `Config ontbreekt: url=${!!supabaseUrl} anon=${!!supabaseAnonKey} pat=${!!githubPAT}` }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return NextResponse.json({ error: `Supabase: ${error.message} (status: ${error.status})` }, { status: 401 });
    }

    console.log('[admin-login] login gelukt voor:', data.user?.email);
    return NextResponse.json({ token: githubPAT });
  } catch (e) {
    return NextResponse.json({ error: `Fout: ${e}` }, { status: 400 });
  }
}
