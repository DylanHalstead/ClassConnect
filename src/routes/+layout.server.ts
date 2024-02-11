import { hydrateAuth, isSignedIn } from 'svelte-google-auth/server';
import { loadFlash, setFlash } from 'sveltekit-flash-message/server';
import { doesUserExist, getUserByEmail, createUser } from '../lib/db/users';
import type { User } from '../lib/types';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = loadFlash(async ({ locals, cookies, fetch }) => {
	let db: {
		user: User;
	} | null = null;
	if (!locals.db && isSignedIn(locals)) {
		if (await doesUserExist(locals.user.email)) {
      db = {user: await getUserByEmail(locals.user.email)};
    } else {
      if (!locals.user.email.endsWith('@uncc.edu') && !locals.user.email.endsWith('@charlotte.edu')) {
        // log user out
        await fetch('/_auth/signout');
        const message = {
          type: 'error',
          message: 'You must use a UNC Charlotte email address to sign in.'
        } as const;
        setFlash(message, cookies)
      } else {
        db = {user: await createUser(locals.user.email, locals.user.given_name, locals.user.family_name)};
      }
    }
	}

	return { ...hydrateAuth(locals), db };
});