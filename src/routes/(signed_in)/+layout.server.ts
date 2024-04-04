import type { LayoutServerLoad } from "./$types";
import { loadFlash, setFlash } from "sveltekit-flash-message/server";
import { verifyAuthentication } from "$lib/auth";

export const load: LayoutServerLoad = loadFlash(async ({ locals, cookies }) => {
	const userID = verifyAuthentication(locals, cookies);
	return {
		userID
	};
});
