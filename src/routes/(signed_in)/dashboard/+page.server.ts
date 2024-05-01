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
import { error } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ cookies }) => {
	const userID = getUserID(cookies);
	const sectionMembers = await getUsersSectionMembers(userID);
	const sectionMembersIDs = sectionMembers.map(sectionMember => sectionMember.id);

	if (sectionMembersIDs == undefined) {
		error(404, "User not found.");
	}

	const studentAppointments = await getStudentsAppointments(sectionMembersIDs);

	const extendedStudentAppointments = await extendAppointments(studentAppointments);
	if (extendedStudentAppointments instanceof Error) {
		throw extendedStudentAppointments;
	}

	extendedStudentAppointments.sort((a, b) => {
		return a.appointment_day.getTime() - b.appointment_day.getTime();
	});

	const appointmentBlocks = await getSectionMembersAppointmentBlocks(sectionMembersIDs);

	if (appointmentBlocks instanceof Error) {
		throw appointmentBlocks;
	}
	const extendedAppointmentBlocks = await extendAppointmentBlocks(appointmentBlocks);
	if (extendedAppointmentBlocks instanceof Error) {
		throw extendedAppointmentBlocks;
	}

	const appointmentBlockAppointments = await getAppointmentBlocksAppointments(
		extendedAppointmentBlocks.map(extendAppointmentBlock => extendAppointmentBlock.id)
	);

	const extendedAppointments = await extendAppointments(appointmentBlockAppointments);

	if (extendedAppointments instanceof Error) {
		throw extendedAppointments;
	}

	return {
		studentAppointments: extendedStudentAppointments,
		taAppointments: extendedAppointments
	};
};
