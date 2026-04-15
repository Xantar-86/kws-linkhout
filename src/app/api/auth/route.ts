import { NextRequest, NextResponse } from 'next/server';

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID!;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET!;

// Stap 1: Decap vraagt om te starten → doorsturen naar GitHub
// Stap 2: GitHub stuurt terug met code → inwisselen voor token → HTML terugsturen naar Decap

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get('code');
  const provider = searchParams.get('provider');

  // Stap 1: geen code → redirect naar GitHub OAuth
  if (!code) {
    const scope = searchParams.get('scope') || 'repo';
    const githubAuthUrl = new URL('https://github.com/login/oauth/authorize');
    githubAuthUrl.searchParams.set('client_id', GITHUB_CLIENT_ID);
    githubAuthUrl.searchParams.set('scope', scope);
    githubAuthUrl.searchParams.set('redirect_uri', `https://kwslinkhout.be/api/auth`);
    return NextResponse.redirect(githubAuthUrl.toString());
  }

  // Stap 2: code aanwezig → inwisselen voor access token
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
      return htmlResponse('error', tokenData.error_description || tokenData.error);
    }

    return htmlResponse('success', tokenData.access_token);

  } catch (error) {
    console.error('OAuth error:', error);
    return htmlResponse('error', 'Authentication failed');
  }
}

// HTML pagina die Decap CMS verwacht na OAuth
function htmlResponse(status: 'success' | 'error', data: string) {
  const message = status === 'success'
    ? `authorization:github:success:${JSON.stringify({ token: data, provider: 'github' })}`
    : `authorization:github:error:${JSON.stringify({ message: data })}`;

  const html = `<!DOCTYPE html>
<html>
<body>
<script>
(function() {
  function receiveMessage(e) {
    window.opener.postMessage('${message}', e.origin);
  }
  window.addEventListener('message', receiveMessage, false);
  window.opener.postMessage('authorizing:github', '*');
})();
</script>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html' },
  });
}
