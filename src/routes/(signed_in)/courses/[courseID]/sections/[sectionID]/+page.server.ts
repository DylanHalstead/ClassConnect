import { verifyAuthentication, verifyUserIsApartOfInstructionalTeam } from "$lib/auth";
import { extendSectionMembers, getSectionSectionMembers } from "$lib/db/sectionMembers";
import { extendSections, getSection } from "$lib/db/sections";
import type { PageServerLoad, Actions } from "./$types";
import { error } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ locals, cookies, params }) => {
	const { sectionID } = params;
	const userID = verifyAuthentication(locals, cookies);

	await verifyUserIsApartOfInstructionalTeam(cookies, userID, sectionID);

	const section = await getSection(sectionID);

	if (section == undefined) {
		error(404, "Section not found.");
	}

	const extendedSections = await extendSections([section]);

	if (extendedSections instanceof Error) {
		throw section;
	}

	const extendedSection = extendedSections[0];

	if (extendedSection == undefined) {
		throw new Error(`I didn't get back a section with the ID ${section.id}`);
	}

	const sectionMembers = await getSectionSectionMembers(sectionID);

	if (sectionMembers.length === 0) {
		error(400, "Must have section members to view this page.");
	}

	const extendedSectionMembers = await extendSectionMembers(sectionMembers);

	if (extendedSectionMembers instanceof Error) {
		throw extendedSectionMembers;
	}

	return {
		section: extendedSection,
		sectionMembers: extendedSectionMembers
	};
};

export const actions: Actions = {
	default: async () => {
		// TODO: Implement Change Section Member Role
	}
};
