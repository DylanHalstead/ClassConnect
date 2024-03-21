import type { LayoutServerLoad } from "./$types";
import { loadFlash, setFlash } from "sveltekit-flash-message/server";
import { error } from "@sveltejs/kit";
import { getUsersSectionMembers } from "../../../../../../lib/db/sectionMembers";

export const load: LayoutServerLoad = loadFlash(async ({ cookies, params, parent }) => {
	const parentVals = await parent();
	const userID: string = parentVals.userID;
	const sectionID = params.sectionID;
	const usersMembers = await getUsersSectionMembers(userID);
	if (!usersMembers) {
		const errorMessage = "Failed to get user's section members.";
		const message = {
			type: "error",
			message: errorMessage
		} as const;
		setFlash(message, cookies);
		error(500, errorMessage);
	}
	const isUserInThisSection = usersMembers.some(member => member.section_id === sectionID);
	if (!isUserInThisSection) {
		const errorMessage = "You are not a member of this section.";
		const message = {
			type: "error",
			message: errorMessage
		} as const;
		setFlash(message, cookies);
		error(403, errorMessage);
	}

	return { userID, usersMembers };
});
