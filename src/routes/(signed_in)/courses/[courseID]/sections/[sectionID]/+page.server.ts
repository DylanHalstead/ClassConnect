import { verifyAuthentication, verifyUserIsApartOfInstructionalTeam } from "$lib/auth";
import { deleteSection, updateSection, getExtendedSection } from "$lib/db/section";
import { getExtendedSectionMembers } from "$lib/db/sectionMembers";
import { setFlash } from "sveltekit-flash-message/server";
import type { PageServerLoad, Actions } from "./$types";
import { error, redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ locals, cookies, params }) => {
	const { sectionID } = params;
	const userID = verifyAuthentication(locals, cookies);
	await verifyUserIsApartOfInstructionalTeam(cookies, userID, sectionID);
	let section = await getExtendedSection(sectionID);
	let sectionMembers = await getExtendedSectionMembers(sectionID);
	if (!section) {
		error(404, "Section not found.");
	}
	if (sectionMembers.length === 0) {
		error(400, "Must have section members to view this page.");
	}
	return {
		section,
		sectionMembers
	};
};

export const actions: Actions = {
	update: async ({ request, cookies, params }) => {
		const { sectionID } = params;
		const data: FormData = await request.formData();
		const formMaxDailyBookableHours = data.get("max_daily_bookable_hours");
		if (!formMaxDailyBookableHours || typeof formMaxDailyBookableHours !== "string") {
			error(400, "Invalid input: missing or invalid max daily bookable hours");
		}
		const formSectionNumber = data.get("section_number");
		if (!formSectionNumber || typeof formSectionNumber !== "string") {
			error(400, "Invalid input: missing or invalid section ID");
		}

		const maxDailyBookableHours = parseFloat(formMaxDailyBookableHours);
		if (isNaN(maxDailyBookableHours) || maxDailyBookableHours < 0) {
			error(400, "Invalid input: max daily bookable hours must be a positive number");
		}
		const sectionNumber = parseInt(formSectionNumber);
		if (isNaN(sectionNumber) || sectionNumber < 0) {
			error(400, "Invalid input: section number must be a positive number");
		}

		// update section
		const section = await updateSection(sectionID, sectionNumber, maxDailyBookableHours);
		if (!section) {
			error(500, `Internal server error: Failed to update section with ID: ${sectionID}`);
		}

		const message = {
			type: "success",
			message: "Section updated successfully!"
		} as const;
		setFlash(message, cookies);
	},
	delete: async ({ request, cookies }) => {
		const data: FormData = await request.formData();
		const sectionID = data.get("sectionID");
		if (!sectionID || typeof sectionID !== "string") {
			error(400, "Invalid input: missing or invalid section ID");
		}

		// delete section
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
	}
};
