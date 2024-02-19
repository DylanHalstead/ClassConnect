import { SvelteGoogleAuthHook } from "svelte-google-auth/server";
import type { Handle } from "@sveltejs/kit";

// Import client credentials from json file
import client_secret from "../client_secret.json";

const auth = new SvelteGoogleAuthHook(client_secret.web);

export const handle: Handle = async ({ event, resolve }) => {
	return await auth.handleAuth({ event, resolve });
};
