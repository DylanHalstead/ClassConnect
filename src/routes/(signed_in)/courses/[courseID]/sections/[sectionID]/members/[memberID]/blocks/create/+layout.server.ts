import type { LayoutServerLoad } from "./$types";
import { loadFlash, setFlash } from "sveltekit-flash-message/server";
import { error } from "@sveltejs/kit";
import { verifyUserIsApartOfInstructionalTeam, verifyUserIsMember } from "../../../../../../../../../../lib/auth";

export const load: LayoutServerLoad = loadFlash(async ({ cookies, params, parent }) => {
	const parentVals = await parent();
	const userID: string | undefined = parentVals.userID;
	const { sectionID, memberID } = params;
	if (!userID || !sectionID || !memberID) {
		const errorMessage = "There was an issue obtaining your user ID, the section ID, or the member ID.";
		error(500, errorMessage);
	}
	await verifyUserIsApartOfInstructionalTeam(cookies, sectionID, userID);
	await verifyUserIsMember(cookies, userID, memberID);
	return { userID };
});
