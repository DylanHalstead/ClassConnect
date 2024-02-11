import { redirect } from '@sveltejs/kit';
import { hydrateAuth, isSignedIn } from 'svelte-google-auth/server';
import { doesUserExist, getUserByEmail, createUser } from '../lib/db/users';
import type { User } from '../lib/types';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	let db: {
		user: User;
	} | null = null;
	if (!locals.db && isSignedIn(locals)) {
		if (await doesUserExist(locals.user.email)) {
      db = {user: await getUserByEmail(locals.user.email)};
    } else {
      if (!locals.user.email.endsWith('@uncc.edu') && !locals.user.email.endsWith('@charlotte.edu')) {
        redirect(307, '_auth/signout')
      } else {
        db = {user: await createUser(locals.user.email, locals.user.given_name, locals.user.family_name)};
      }
    }
	}

	return { ...hydrateAuth(locals), db };
};