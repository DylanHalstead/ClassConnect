import { hydrateAuth, isSignedIn } from "svelte-google-auth/server";
import { loadFlash, setFlash } from "sveltekit-flash-message/server";
import { getUserByEmail, createUser } from "$lib/db/users";
import type { User } from "$lib/types";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = loadFlash(async ({ locals, cookies, fetch }) => {
	let db:
		| {
				user: User;
		  }
		| undefined = undefined;
	// If the user has signed in with google but hasn't grabbed their data from the database
	if (!locals.db && isSignedIn(locals)) {
		let user = await getUserByEmail(locals.user.email);
		let messageType = "";
		let messageContent = "";
		if (user) {
			messageType = "success";
			messageContent = "Logged in successfully!";
		} else {
			if (
				!locals.user.email.endsWith("@uncc.edu") &&
				!locals.user.email.endsWith("@charlotte.edu")
			) {
				await fetch("/_auth/signout");
				messageType = "error";
				messageContent = "You must use a UNC Charlotte email address to sign in.";
			} else {
				user = await createUser(locals.user.email, locals.user.given_name, locals.user.family_name);
				messageType = "success";
				messageContent = "Created account successfully!";
			}
		}
		if (user) {
			db = {
				user: user
			};
			cookies.set("userID", db.user.id, { path: "/" });
		}
		const message = {
			type: messageType,
			message: messageContent
		};
		setFlash(message, cookies);
	}

	return { ...hydrateAuth(locals), db };
});
