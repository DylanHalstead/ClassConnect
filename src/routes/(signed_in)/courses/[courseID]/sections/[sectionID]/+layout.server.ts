import type { LayoutServerLoad } from "./$types";
import { loadFlash } from "sveltekit-flash-message/server";
import { verifyUserIsInSection } from "$lib/auth";
import { error } from "@sveltejs/kit";

export const load: LayoutServerLoad = loadFlash(async ({ cookies, params, parent }) => {
	const parentVals = await parent();
	const userID: string | undefined = parentVals["userID"];
	const { sectionID } = params;
	if (!userID || !sectionID) {
		const errorMessage = "There was an issue obtaining your user ID or the section ID.";
		error(500, errorMessage);
	}
	await verifyUserIsInSection(cookies, userID, sectionID);

	return { userID };
});
