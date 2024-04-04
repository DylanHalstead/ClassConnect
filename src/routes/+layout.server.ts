import { hydrateAuth, isSignedIn } from "svelte-google-auth/server";
import { loadFlash, setFlash } from "sveltekit-flash-message/server";
import { getUserByEmail, createUser } from "$lib/db/users";
import type { User } from "$lib/types";
import type { LayoutServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load: LayoutServerLoad = loadFlash(async ({ locals, cookies, fetch, url }) => {
	let db:
		| {
				user: User;
		  }
		| undefined = undefined;
	// If the user has signed in with google but hasn't grabbed their data from the database
	if (!locals.db && isSignedIn(locals)) {
		let user = await getUserByEmail(locals.user.email);
		let messageType: "success" | "error";
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
				user = await createUser({
					email: locals.user.email,
					first_name: locals.user.given_name,
					last_name: locals.user.family_name
				});

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

		if (url.pathname === "/") {
			redirect(302, "/dashboard");
		}
	}

	return { ...hydrateAuth(locals), db };
});
