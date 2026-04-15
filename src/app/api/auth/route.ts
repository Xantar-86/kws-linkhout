import { NextRequest, NextResponse } from 'next/server';

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID!;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET!;

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get('code');

  // Stap 1: geen code → redirect naar GitHub OAuth
  if (!code) {
    const scope = searchParams.get('scope') || 'repo';
    const githubAuthUrl = new URL('https://github.com/login/oauth/authorize');
    githubAuthUrl.searchParams.set('client_id', GITHUB_CLIENT_ID);
    githubAuthUrl.searchParams.set('scope', scope);
    githubAuthUrl.searchParams.set('redirect_uri', 'https://kwslinkhout.be/admin-static/auth-callback.html');
    return NextResponse.redirect(githubAuthUrl.toString());
  }

  // Stap 2: code aanwezig → inwisselen voor access token, JSON teruggeven
  try {
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: 'https://kwslinkhout.be/admin-static/auth-callback.html',
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return NextResponse.json({ error: tokenData.error_description || tokenData.error }, { status: 400 });
    }

    return NextResponse.json({ token: tokenData.access_token });

  } catch (error) {
    console.error('OAuth error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
