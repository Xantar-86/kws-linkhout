import { NextResponse } from 'next/server';

// Decap's OAuth popup flow is niet meer in gebruik.
// Inloggen gebeurt via /api/admin-login (Supabase) en de GitHub PAT
// wordt rechtstreeks in localStorage gezet door /admin/index.html.
// Als Decap deze route alsnog aanroept (bv. na logout), stuur terug naar /admin.
export async function GET() {
  return NextResponse.redirect('https://www.kwslinkhout.be/admin');
}
