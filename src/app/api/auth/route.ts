import { NextRequest, NextResponse } from 'next/server';

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 });
  }

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
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      // Redirect to login with error
      const url = new URL('/admin-static/login.html', request.url);
      url.searchParams.set('error', tokenData.error);
      return NextResponse.redirect(url);
    }

    // Redirect to login with token in hash
    const url = new URL('/admin-static/login.html', request.url);
    url.hash = `access_token=${tokenData.access_token}&token_type=bearer`;
    return NextResponse.redirect(url);
    
  } catch (error) {
    console.error('OAuth error:', error);
    const url = new URL('/admin-static/login.html', request.url);
    url.searchParams.set('error', 'Authentication failed');
    return NextResponse.redirect(url);
  }
}
