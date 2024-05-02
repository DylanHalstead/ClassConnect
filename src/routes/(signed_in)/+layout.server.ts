import { verifyAuthentication } from "$lib/auth";
import type { LayoutServerLoad } from "./$types";
import { loadFlash } from "sveltekit-flash-message/server";

export const load: LayoutServerLoad = loadFlash(async ({ locals, cookies }) => {
	const userID = verifyAuthentication(locals, cookies);
	return {
		userID
	};
});
