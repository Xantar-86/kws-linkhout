import { NextRequest, NextResponse } from 'next/server';

// GitHub OAuth handler for Decap CMS
// This runs on Vercel and handles the OAuth flow

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  if (!code) {
    // Step 1: Redirect to GitHub OAuth
    const redirectUri = `${request.nextUrl.origin}/api/auth`;
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=repo&state=${state || ''}`;
    return NextResponse.redirect(githubAuthUrl);
  }

  // Step 2: Exchange code for access token
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
      return NextResponse.json({ error: tokenData.error }, { status: 400 });
    }

    // Return HTML that passes token to parent window (Decap CMS)
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Authenticating...</title>
</head>
<body>
  <script>
    (function() {
      function receiveMessage(e) {
        if (e.origin !== '${request.nextUrl.origin}') return;
        
        if (e.data === 'authorizing:github') {
          e.source.postMessage(
            'authorization:github:success:${tokenData.access_token}',
            e.origin
          );
        }
      }
      
      window.addEventListener('message', receiveMessage, false);
      
      // Also try to communicate with parent
      if (window.opener) {
        window.opener.postMessage('authorizing:github', '${request.nextUrl.origin}');
      }
      
      // Redirect after a short delay
      setTimeout(function() {
        window.location.href = '/admin/';
      }, 1000);
    })();
  </script>
  <p>Authenticatie succesvol! Doorverwijzen...</p>
</body>
</html>`;

    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (error) {
    console.error('OAuth error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
