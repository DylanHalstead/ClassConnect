import {
	verifyAuthentication,
	verifyUserIsInSection,
	verifyUserIsApartOfInstructionalTeam,
	verifyUserIsMember
} from "$lib/auth";
import {
	getMembersAppointmentBlocks,
	createAppointmentBlock,
	deleteAppointmentBlocks
} from "$lib/db/appointmentBlocks";
import { getExtendedSection } from "$lib/db/section";
import { type AppointmentBlock, WeekDay } from "$lib/types";
import { formTimeToDate, getEnumValue } from "$lib/utils";
import type { PageServerLoad, Actions } from "./$types";
import { redirect, error } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ locals, cookies, params }) => {
	const { sectionID } = params;
	const userID = verifyAuthentication(locals, cookies);
	await verifyUserIsApartOfInstructionalTeam(cookies, userID, sectionID);
	let section = await getExtendedSection(sectionID);
	if (!section) {
		error(404, "Section not found.");
	}
	return {
		section,
	};
};

export const actions: Actions = {
	default: async ({ locals, request, params, cookies }) => {
		const { sectionID, memberID } = params;
		if (!sectionID || !memberID) {
			const errorMessage = "Internal server error: Failed to get section ID or member ID";
			error(500, errorMessage);
		}
		const userID = verifyAuthentication(locals, cookies);
		await verifyUserIsInSection(cookies, userID, sectionID);
		await verifyUserIsApartOfInstructionalTeam(cookies, userID, sectionID);
		await verifyUserIsMember(cookies, userID, memberID);

		const data: FormData = await request.formData();
		const startTime = data.get("start-time");
		const endTime = data.get("end-time");
		if (!startTime || !endTime || typeof startTime !== "string" || typeof endTime !== "string") {
			error(400, "Invalid input: missing or invalid times");
		}
		const formDayOfWeek = data.get("day-of-week");
		if (!formDayOfWeek || typeof formDayOfWeek !== "string") {
			error(400, "Invalid input: missing or invalid day of the week");
		}
		const dayOfWeek = getEnumValue(formDayOfWeek, WeekDay);
		if (!dayOfWeek) {
			error(400, "Invalid input: Invalid day of the week");
		}

		const start = formTimeToDate(startTime);
		const end = formTimeToDate(endTime);
		if (!start || !end) {
			error(400, "Invalid input: Invalid time format");
		}
		if (start >= end) {
			error(400, "Invalid input: Start time must be before end");
		}

		let duration = end.getTime() - start.getTime();
		// Validate that the start-time and end-time aren't conflicting with existing appointment blocks
		const membersBlocks = await getMembersAppointmentBlocks(params.memberID);
		if (!membersBlocks) {
			error(500, "Internal server error: Failed to get appointment blocks");
		}
		const possiblyConflictingBlocks = membersBlocks.filter(block => block.week_day === dayOfWeek);
		const mergeableBlocks: AppointmentBlock[] = [];
		for (const block of possiblyConflictingBlocks) {
			const blockStart = block.start_time;
			const blockEnd = new Date(blockStart.getTime() + block.duration);
			const startMillis = start.getTime();
			const endMillis = end.getTime();
			const blockStartMillis = blockStart.getTime();
			const blockEndMillis = blockEnd.getTime();

			if (
				(startMillis < blockStartMillis && endMillis > blockStartMillis) ||
				(startMillis < blockEndMillis && endMillis > blockEndMillis) ||
				(startMillis > blockStartMillis && endMillis < blockEndMillis)
			) {
				error(400, "Invalid input: times conflict with existing block");
			}

			// concatinate blocks if they are touching
			if (
				startMillis === blockStartMillis ||
				endMillis === blockEndMillis ||
				endMillis === blockStartMillis ||
				startMillis === blockEndMillis
			) {
				mergeableBlocks.push(block);
			}
		}
		// if there are mergeable blocks, delete them and adjust the start and end times
		if (mergeableBlocks.length > 0) {
			if (await deleteAppointmentBlocks(mergeableBlocks.map(block => block.id))) {
				error(500, "Internal server error: Failed to delete conflicting blocks");
			}
			const earliestStart = new Date(
				Math.min(...mergeableBlocks.map(block => block.start_time.getTime()), start.getTime())
			);
			const latestEnd = new Date(
				Math.max(
					...mergeableBlocks.map(block => block.start_time.getTime() + block.duration),
					end.getTime()
				)
			);
			start.setTime(earliestStart.getTime());
			end.setTime(latestEnd.getTime());
			duration = latestEnd.getTime() - earliestStart.getTime();
		}

		await createAppointmentBlock({
			instructional_member_id: params.memberID,
			week_day: dayOfWeek,
			start_time: start,
			duration
		});

		redirect(303, `/courses/${params.courseID}/sections/${params.sectionID}`);
	}
};
