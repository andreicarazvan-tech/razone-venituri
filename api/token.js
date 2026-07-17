export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const cookies = parseCookies(req.headers.cookie || '');
  const accessToken = cookies.at;
  const refreshToken = cookies.rt;

  if (!refreshToken) return res.status(401).json({ error: 'not_authenticated' });
  if (accessToken) return res.status(200).json({ access_token: accessToken });

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      grant_type: 'refresh_token'
    })
  });

  const tokens = await tokenRes.json();
  if (tokens.error) {
    res.setHeader('Set-Cookie', ['rt=; Max-Age=0; Path=/', 'at=; Max-Age=0; Path=/']);
    return res.status(401).json({ error: 'refresh_failed' });
  }

  res.setHeader('Set-Cookie', 
    `at=${tokens.access_token}; HttpOnly; Secure; SameSite=Strict; Max-Age=${3500}; Path=/`
  );

  return res.status(200).json({ access_token: tokens.access_token });
}

function parseCookies(str) {
  return str.split(';').reduce((acc, part) => {
    const [k, ...v] = part.trim().split('=');
    if (k) acc[k.trim()] = v.join('=').trim();
    return acc;
  }, {});
}
