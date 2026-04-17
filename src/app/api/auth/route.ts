import { NextRequest, NextResponse } from 'next/server';

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID!;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET!;

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const kwsPat = searchParams.get('kws_pat');
  const code = searchParams.get('code');

  // PAT-flow: geef een HTML popup terug die de Decap-handshake afhandelt
  if (kwsPat) {
    const provider = searchParams.get('provider') || 'github';
    const html = `<!doctype html>
<html><head><meta charset="utf-8"><title>Inloggen...</title></head>
<body><p>Bezig met inloggen...</p>
<script>
(function() {
  try {
    var pat = atob(${JSON.stringify(kwsPat)});
    var provider = ${JSON.stringify(provider)};
    var successMsg = 'authorization:' + provider + ':success:' + JSON.stringify({ token: pat, provider: provider });

    // Stap 1: stuur handshake naar opener (Decap luistert hierop)
    if (window.opener && !window.opener.closed) {
      window.opener.postMessage('authorizing:' + provider, window.location.origin);
    }

    // Stap 2: wacht op echo van Decap, stuur dan success
    window.addEventListener('message', function(e) {
      if (typeof e.data === 'string' && e.data.indexOf('authorizing:') === 0) {
        if (window.opener && !window.opener.closed) {
          window.opener.postMessage(successMsg, e.origin || '*');
        }
        setTimeout(function() { window.close(); }, 300);
      }
    });
  } catch(err) {
    document.querySelector('p').textContent = 'Fout: ' + err.message;
  }
})();
</script>
</body></html>`;
    return new Response(html, {
      headers: { 'Content-Type': 'text/html', 'Cache-Control': 'no-store' }
    });
  }

  // Stap 1: geen code → redirect naar GitHub OAuth
  if (!code) {
    const scope = searchParams.get('scope') || 'repo';
    const githubAuthUrl = new URL('https://github.com/login/oauth/authorize');
    githubAuthUrl.searchParams.set('client_id', GITHUB_CLIENT_ID);
    githubAuthUrl.searchParams.set('scope', scope);
    githubAuthUrl.searchParams.set('redirect_uri', 'https://kwslinkhout.be/admin-static/auth-callback.html');
    return NextResponse.redirect(githubAuthUrl.toString());
  }

  // Stap 2: code aanwezig → inwisselen voor access token
  try {
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
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
