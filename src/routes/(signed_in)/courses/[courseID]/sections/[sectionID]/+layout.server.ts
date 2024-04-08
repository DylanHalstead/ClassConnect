import { verifyUserIsInSection } from "$lib/auth";
import type { LayoutServerLoad } from "./$types";
import { error } from "@sveltejs/kit";
import { loadFlash } from "sveltekit-flash-message/server";

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
