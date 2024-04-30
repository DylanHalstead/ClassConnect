import { verifyAuthentication, verifyUserIsApartOfInstructionalTeam, getUserID } from "$lib/auth";
import {
	deleteSectionMember,
	updateSectionMember,
	getSectionMembers,
	getSectionsSectionMembers,
	extendSectionMembers
} from "$lib/db/sectionMembers";
import { deleteSection, getSections, updateSection, extendSections } from "$lib/db/sections";
import { SectionMemberType, type PartialSection, type PartialSectionMember } from "$lib/types";
import { getEnumValue } from "$lib/utils";
import type { PageServerLoad, Actions } from "./$types";
import { error, redirect, fail } from "@sveltejs/kit";
import { setFlash } from "sveltekit-flash-message/server";

export const load: PageServerLoad = async ({ locals, cookies, params }) => {
	const { sectionID } = params;
	const userID = verifyAuthentication(locals, cookies);

	await verifyUserIsApartOfInstructionalTeam(cookies, userID, sectionID);

	const section = await getSections([sectionID]);

	if (section == undefined) {
		error(404, "Section not found.");
	}

	const extendedSections = await extendSections(section);

	if (extendedSections instanceof Error) {
		throw section;
	}

	const extendedSection = extendedSections[0];

	if (extendedSection == undefined) {
		throw new Error(`I didn't get back a section with the ID ${sectionID}`);
	}

	const sectionMembers = await getSectionsSectionMembers([sectionID]);

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
	updateSection: async ({ request, cookies, params }) => {
		const { courseID, sectionID } = params;
		const userID = getUserID(cookies);
		await verifyUserIsApartOfInstructionalTeam(cookies, userID, sectionID);

		const data: FormData = await request.formData();
		const formMaxDailyBookableHours = data.get("max_daily_bookable_hours");
		if (!formMaxDailyBookableHours) {
			return fail(400, { maxDailyBookableHours: formMaxDailyBookableHours, missing: true });
		}
		if (typeof formMaxDailyBookableHours !== "string") {
			return fail(400, { maxDailyBookableHours: formMaxDailyBookableHours, invalid: true });
		}
		const formSectionNumber = data.get("section_number");
		if (!formSectionNumber) {
			return fail(400, { sectionNumber: formSectionNumber, missing: true });
		}
		if (typeof formSectionNumber !== "string") {
			return fail(400, { sectionNumber: formSectionNumber, invalid: true });
		}

		const maxDailyBookableHours = parseFloat(formMaxDailyBookableHours);
		if (isNaN(maxDailyBookableHours) || maxDailyBookableHours < 0) {
			return fail(400, { maxDailyBookableHours, invalid: true });
		}
		const sectionNumber = parseInt(formSectionNumber);
		if (isNaN(sectionNumber) || sectionNumber < 0) {
			return fail(400, { sectionNumber, invalid: true });
		}

		const partialSection: PartialSection = {
			max_daily_bookable_hours: maxDailyBookableHours,
			section_number: sectionNumber,
			course_id: courseID
		};
		const section = await updateSection(sectionID, partialSection);
		if (!section) {
			error(500, `Internal server error: Failed to update section with ID: ${sectionID}`);
		}

		const message = {
			type: "success",
			message: "Section updated successfully!"
		} as const;
		setFlash(message, cookies);
		redirect(302, `/courses/${courseID}/sections/${sectionID}`);
	},
	deleteSection: async ({ cookies, params }) => {
		const { sectionID } = params;
		const userID = getUserID(cookies);
		await verifyUserIsApartOfInstructionalTeam(cookies, userID, sectionID);

		const deleted = await deleteSection(sectionID);
		if (!deleted) {
			error(500, `Internal server error: Failed to delete section with ID: ${sectionID}`);
		}

		const message = {
			type: "success",
			message: "Section deleted successfully!"
		} as const;
		setFlash(message, cookies);
		redirect(302, "/dashboard");
	},
	updateSectionMember: async ({ request, cookies, params }) => {
		const { courseID, sectionID } = params;
		const userID = getUserID(cookies);
		await verifyUserIsApartOfInstructionalTeam(cookies, userID, sectionID);

		const data = await request.formData();
		const memberID = data.get("member-id");
		if (!memberID) {
			return fail(400, { memberID, missing: true });
		}
		if (typeof memberID !== "string") {
			return fail(400, { memberID, invalid: true });
		}

		const member = await getSectionMembers([memberID]);
		if (!member || !member[0]) {
			return fail(404, { memberID, notFound: true });
		}

		const formSectionMemberType = data.get("section-member-type");
		if (!formSectionMemberType) {
			return fail(400, { sectionMemberType: formSectionMemberType, missing: true });
		}
		if (typeof formSectionMemberType !== "string") {
			return fail(400, { sectionMemberType: formSectionMemberType, invalid: true });
		}
		const formIsRestricted = data.get("is-restricted");
		if (formIsRestricted && formIsRestricted !== "on") {
			return fail(400, { isRestricted: formIsRestricted, invalid: true });
		}
		if (formIsRestricted && member[0].member_type !== "student") {
			return fail(400, { isRestricted: formIsRestricted, invalid: true });
		}
		const sectionMemberType = getEnumValue(formSectionMemberType, SectionMemberType);
		if (!sectionMemberType) {
			return fail(400, { sectionMemberType: formSectionMemberType, invalid: true });
		}
		let isRestricted = formIsRestricted === "on";

		const partialSectionMember: PartialSectionMember = {
			member_type: sectionMemberType,
			is_restricted: isRestricted,
			section_id: sectionID,
			user_id: member[0].user_id
		};
		const updatedMember = await updateSectionMember(memberID, partialSectionMember);
		if (!updatedMember) {
			error(500, "Failed to update member");
		}
		redirect(302, `/courses/${courseID}/sections/${sectionID}`);
	},
	deleteSectionMember: async ({ request, cookies, params }) => {
		const { courseID, sectionID } = params;
		const userID = getUserID(cookies);
		await verifyUserIsApartOfInstructionalTeam(cookies, userID, sectionID);

		const data = await request.formData();
		const memberID = data.get("member-id");
		if (!memberID) {
			return fail(400, { memberID, missing: true });
		}
		if (typeof memberID !== "string") {
			return fail(400, { memberID, invalid: true });
		}
		const member = await getSectionMembers([memberID]);
		if (!member || !member[0]) {
			return fail(404, { memberID, notFound: true });
		}

		const isDeleted = await deleteSectionMember(memberID);
		if (isDeleted) {
			redirect(302, `/courses/${courseID}/sections/${sectionID}`);
		} else {
			error(500, "Failed to delete member");
		}
	}
};
