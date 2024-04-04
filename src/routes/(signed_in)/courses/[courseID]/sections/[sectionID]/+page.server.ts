import type { PageServerLoad, Actions } from "./$types";
import { getExtendedSectionMembers } from "$lib/db/sectionMembers";
import { getExtendedSection } from "$lib/db/section";
import { verifyAuthentication, verifyUserIsApartOfInstructionalTeam } from "$lib/auth";
import { error } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ locals, cookies, params }) => {
	const { sectionID } = params;
	const userID = verifyAuthentication(locals, cookies);
	await verifyUserIsApartOfInstructionalTeam(cookies, userID, sectionID);
	let section = await getExtendedSection(sectionID);
	let sectionMembers = await getExtendedSectionMembers(sectionID);
	if (!section) {
		error(404, "Section not found.");
	}
	if (!sectionMembers) {
		error(400, "Must have section members to view this page.");
	}
	return {
		section,
		sectionMembers
	};
};

export const actions: Actions = {
	default: async () => {
		// TODO: Implement Change Section Member Role
	}
};
