import type { LayoutServerLoad } from './$types';
import { loadFlash, setFlash } from 'sveltekit-flash-message/server';
import { isSignedIn } from 'svelte-google-auth/server';
import { error } from '@sveltejs/kit';

export const load: LayoutServerLoad = loadFlash(async ({ locals, cookies }) => {
  const userID: string | undefined = cookies.get('userID');
  if(!isSignedIn(locals) || !userID) {
    const errorMessage = 'You must be signed in to view this page.';
    const message = {
      type: 'error',
      message: errorMessage
    } as const;
    setFlash(message, cookies);
    error(401, errorMessage)
  }
  return {
    userID
  }
});