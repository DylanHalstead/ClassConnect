import {
	extendAppointmentBlocks,
	getSectionMembersAppointmentBlocks
} from "$lib/db/appointmentBlocks";
import {
	extendAppointments,
	getAppointmentBlocksAppointments,
	getStudentsAppointments
} from "$lib/db/appointments";
import { getSectionsSectionMembers, getUsersSectionMembers } from "$lib/db/sectionMembers";
import {
	type ExtendedAppointment,
	type ExtendedAppointmentBlock,
	type SectionMember
} from "$lib/types";
import type { PageServerLoad } from "./$types";
import type { Cookies } from "@sveltejs/kit";

async function getUserAppointmentBlocks(
	sectionMembers: SectionMember[]
): Promise<ExtendedAppointmentBlock[] | Error> {
	const sectionSectionMemberIds = (
		await getSectionsSectionMembers(sectionMembers.map(sectionMember => sectionMember.section_id))
	).map(sectionMember => sectionMember.id);

	const appointmentBlocks = await getSectionMembersAppointmentBlocks(sectionSectionMemberIds);

	if (appointmentBlocks instanceof Error) {
		return appointmentBlocks;
	}

	const sectionMembersIds = new Set(sectionMembers.map(sectionMember => sectionMember.id));
	const appointmentBlocksExcludingOwn = appointmentBlocks.filter(
		appointmentBlock => !sectionMembersIds.has(appointmentBlock.instructional_member_id)
	);

	return await extendAppointmentBlocks(appointmentBlocksExcludingOwn);
}

async function getUserAppointments(
	sectionMemberIds: string[]
): Promise<ExtendedAppointment[] | Error> {
	const appointments = await getStudentsAppointments(sectionMemberIds);

	return await extendAppointments(appointments);
}

async function getUserTAAppointmentBlocks(
	sectionMemberIds: string[]
): Promise<ExtendedAppointmentBlock[] | Error> {
	const appointmentBlocks = await getSectionMembersAppointmentBlocks(sectionMemberIds);

	if (appointmentBlocks instanceof Error) {
		return appointmentBlocks;
	}

	return await extendAppointmentBlocks(appointmentBlocks);
}

async function getUserTAAppointments(
	appointmentBlocks: ExtendedAppointmentBlock[]
): Promise<ExtendedAppointment[] | Error> {
	const appointments = await getAppointmentBlocksAppointments(
		appointmentBlocks.map(appointmentBlock => appointmentBlock.id)
	);

	return await extendAppointments(appointments);
}

export const load: PageServerLoad = async ({ cookies }: { cookies: Cookies }) => {
	const userId = cookies.get("userID");

	if (userId == undefined) {
		return {
			appointments: [],
			appointmentBlocks: []
		};
	}

	const sectionMembers = await getUsersSectionMembers(userId);
	const sectionMemberIds = sectionMembers.map(sectionMember => sectionMember.id);
	const userAppointmentBlocks = await getUserAppointmentBlocks(sectionMembers);

	if (userAppointmentBlocks instanceof Error) {
		throw userAppointmentBlocks;
	}

	const userAppointments = await getUserAppointments(sectionMemberIds);

	if (userAppointments instanceof Error) {
		throw userAppointments;
	}

	const userTAAppointmentBlocks = await getUserTAAppointmentBlocks(sectionMemberIds);

	if (userTAAppointmentBlocks instanceof Error) {
		throw userTAAppointmentBlocks;
	}

	const userTAAppointments = await getUserTAAppointments(userTAAppointmentBlocks);

	if (userTAAppointments instanceof Error) {
		throw userTAAppointments;
	}

	return {
		appointments: [...userAppointments, ...userTAAppointments],
		appointmentBlocks: [...userAppointmentBlocks, ...userTAAppointmentBlocks]
	};
};
