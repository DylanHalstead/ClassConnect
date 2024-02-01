import { redirect } from '@sveltejs/kit';
import type { Actions } from '@sveltejs/kit';
import { OAuth2Client } from 'google-auth-library';

import { PUBLIC_URI } from '$env/static/public';
import { SECRET_OAUTH_CLIENT_ID, SECRET_OAUTH_SECRET } from '$env/static/private';

export const actions = {
	OAuth2: async () => {
  const redirect_uri = new URL('/oauth', PUBLIC_URI).href;
	console.log('redirect_uri', redirect_uri);
		const oAuth2Client = new OAuth2Client(SECRET_OAUTH_CLIENT_ID, SECRET_OAUTH_SECRET, redirect_uri);
		const authorizeUrl = oAuth2Client.generateAuthUrl({
			access_type: 'offline',
			scope: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile', 'openid'],
			prompt: 'consent',
		});
		throw redirect(302, authorizeUrl);
	}
} satisfies Actions;