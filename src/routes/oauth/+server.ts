import { redirect } from '@sveltejs/kit';
import { OAuth2Client } from 'google-auth-library';

import { PUBLIC_URI } from '$env/static/public';
import { SECRET_OAUTH_CLIENT_ID, SECRET_OAUTH_SECRET } from '$env/static/private';

export const GET = async ({url}) => {
  const redirect_uri = new URL('/oauth', PUBLIC_URI).href;
  const code = await url.searchParams.get('code') || '';
  // console.log('code', code);

  try {
		const oAuth2Client = new OAuth2Client(SECRET_OAUTH_CLIENT_ID, SECRET_OAUTH_SECRET, redirect_uri);
    
    const r = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(r.tokens);
    // console.log('Auth Tokens Receiced');
    const user = oAuth2Client.credentials
    console.log('Credentials', user);
  } catch (err) {
    console.log('Something happened with Google Auth', err);
  }
  throw redirect(303, '/');
}