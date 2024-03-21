import type { LayoutServerLoad } from "./$types";
import { loadFlash, setFlash } from "sveltekit-flash-message/server";
import { verifyAuthentication } from "../../lib/auth";

export const load: LayoutServerLoad = loadFlash(async ({ locals, cookies }) => {
	verifyAuthentication(locals, cookies);
	const userID: string | undefined = cookies.get("userID");
	return {
		userID
	};
});
