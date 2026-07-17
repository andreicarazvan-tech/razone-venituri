export default function handler(req, res) {
  const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  url.searchParams.set('client_id', process.env.GOOGLE_CLIENT_ID);
  url.searchParams.set('redirect_uri', process.env.REDIRECT_URI);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('scope', 'https://www.googleapis.com/auth/drive.file');
  url.searchParams.set('access_type', 'offline');
  url.searchParams.set('prompt', 'consent');
  res.redirect(url.toString());
}
