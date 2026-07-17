export default async function handler(req, res) {
  const { code } = req.query;
  if (!code) return res.status(400).send('No code');

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.REDIRECT_URI;

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code, client_id: clientId, client_secret: clientSecret,
      redirect_uri: redirectUri, grant_type: 'authorization_code'
    })
  });
  
  const tokens = await tokenRes.json();
  if (tokens.error) return res.status(400).send('Token error: ' + tokens.error);

  res.setHeader('Set-Cookie', [
    `rt=${tokens.refresh_token}; HttpOnly; Secure; SameSite=Strict; Max-Age=${60*60*24*365}; Path=/`,
    `at=${tokens.access_token}; HttpOnly; Secure; SameSite=Strict; Max-Age=${3500}; Path=/`
  ]);
  
  res.redirect('/');
}
