import { hydrateAuth, generateAuthUrl, isSignedIn } from 'svelte-google-auth/server';
import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

const SCOPES = ['openid', 'profile', 'email'];

export const load: LayoutServerLoad = ({ locals, url }) => {
	// This snippet makes it so you MUST be logged in to be on the website at all. Can be moved to a different layout (so like every /calendar or anything not the homescreen needs to be logged in to access it)
	// if (!isSignedIn(locals)) {
	// 	throw redirect(302, generateAuthUrl(locals, url, SCOPES, url.pathname));
	// }
	// By calling hydateAuth, certain variables from locals are parsed to the client
	// allowing the client to access the user information and the client_id for login
	return { ...hydrateAuth(locals) };
};