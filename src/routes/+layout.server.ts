import { redirect } from '@sveltejs/kit';
import { hydrateAuth, isSignedIn } from 'svelte-google-auth/server';
import { doesUserExist, getUserByEmail, createUser } from '../lib/db/users';
import type { User } from '../lib/types';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	let db: {
		user: User;
	} | null = null;
  console.log("hello world")
	if (!locals.db && isSignedIn(locals)) {
    console.log('User is signed in');
		if (await doesUserExist(locals.user.email)) {
      console.log('User exists');
      db = {user: await getUserByEmail(locals.user.email)};
    } else {
      console.log('User does not exist');
      if (!locals.user.email.endsWith('@uncc.edu') && !locals.user.email.endsWith('@charlotte.edu')) {
        console.log('User does not have a valid email');
        redirect(307, '_auth/signout')
      } else {
        console.log('Creating user');
        db = {user: await createUser(locals.user.email, locals.user.given_name, locals.user.family_name)};
      }
    }
	}

	return { ...hydrateAuth(locals), db };
};