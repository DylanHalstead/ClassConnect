import { getUserID } from "$lib/auth";
import {
	extendAppointmentBlocks,
	getSectionMembersAppointmentBlocks
} from "$lib/db/appointmentBlocks";
import {
	extendAppointments,
	getAppointmentBlocksAppointments,
	getStudentsAppointments
} from "$lib/db/appointments";
import { getUsersSectionMembers } from "$lib/db/sectionMembers";
import type { PageServerLoad } from "./$types";
import type { Cookies } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ cookies }: { cookies: Cookies }) => {
	const userID = getUserID(cookies);
	const sectionMembers = await getUsersSectionMembers(userID);
	const sectionMemberIds = sectionMembers.map(sectionMember => sectionMember.id);
	const appointmentBlocks = await getSectionMembersAppointmentBlocks(sectionMemberIds);

	if (appointmentBlocks == undefined) {
		throw new Error("Error fetching appointment blocks from the database.");
	}

	const extendedAppointmentBlocks = await extendAppointmentBlocks(appointmentBlocks);

	if (extendedAppointmentBlocks == undefined) {
		throw new Error("Error extending appointment blocks.");
	}

	const appointments = [
		...(await getAppointmentBlocksAppointments(
			extendedAppointmentBlocks.map(appointmentBlock => appointmentBlock.id)
		)),

		...(await getStudentsAppointments(sectionMemberIds))
	];

	const extendedAppointments = await extendAppointments(appointments);

	if (extendedAppointments == undefined) {
		throw new Error("Error extending appointments.");
	}

	return {
		appointments: extendedAppointments,
		appointmentBlocks: extendedAppointmentBlocks
	};
};
