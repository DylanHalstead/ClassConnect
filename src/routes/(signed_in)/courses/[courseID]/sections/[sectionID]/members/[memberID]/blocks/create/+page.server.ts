import type { Actions } from "./$types";
import { AppointmentBlock, SectionMember, SectionMemberType, WeekDay } from "$lib/types";
import { getUsersSectionMembers } from "$lib/db/sectionMembers";
import {
	getMembersAppointmentBlocks,
	createAppointmentBlock,
	deleteAppointmentBlocks
} from "$lib/db/appointmentBlocks";
import { stringToWeekDay } from "$lib/utils";
import { isSignedIn } from "svelte-google-auth/server";
import { redirect, error } from "@sveltejs/kit";

export const actions: Actions = {
	default: async ({ locals, request, params, cookies }) => {
		const userID: string | undefined = cookies.get("userID");
		if (!isSignedIn(locals) || !userID) {
			error(401, { message: "Unauthorized: not logged in" });
		}
		// Validate user owns the memberID
		const usersMembers: SectionMember[] = await getUsersSectionMembers(userID);
		const member = usersMembers.find(member => member.id === params.memberID);
		if (
			!member ||
			(member.member_type !== SectionMemberType.TA &&
				member.member_type !== SectionMemberType.Instructor)
		) {
			error(403, { message: "Forbidden: Not a part of the instructional team" });
		}

		const data: FormData = await request.formData();
		const startTime = data.get("start-time");
		const endTime = data.get("end-time");
		if (!startTime || !endTime || typeof startTime !== "string" || typeof endTime !== "string") {
			error(400, { message: "Invalid input: missing or invalid times" });
		}
		const formDayOfWeek = data.get("day-of-week");
		if (!formDayOfWeek || typeof formDayOfWeek !== "string") {
			error(400, { message: "Invalid input: missing or invalid day of the week" });
		}
		const dayOfWeek = stringToWeekDay(formDayOfWeek);
		if (!dayOfWeek) {
			error(400, { message: "Invalid input: Invalid day of the week" });
		}

		const start = new Date(0);
		const [startHours, startMinues] = startTime.split(":").map(num => parseInt(num));
		start.setHours(startHours);
		start.setMinutes(startMinues);
		const end = new Date(0);
		const [endHours, endMinues] = endTime.split(":").map(num => parseInt(num));
		end.setHours(endHours);
		end.setMinutes(endMinues);
		if (start >= end) {
			error(400, { message: "Invalid input: Start time must be before end" });
		}

		let duration = end.getTime() - start.getTime();
		// Validate that the start-time and end-time aren't conflicting with existing appointment blocks
		const membersBlocks: AppointmentBlock[] = await getMembersAppointmentBlocks(params.memberID);
		const possiblyConflictingBlocks = membersBlocks.filter(block => block.week_day === dayOfWeek);
		const mergeableBlocks: AppointmentBlock[] = [];
		for (const block of possiblyConflictingBlocks) {
			const blockStart = block.start_time;
			const blockEnd = new Date(blockStart.getTime() + block.duration);
			const startMillis = start.getTime();
			const endMillis = end.getTime();
			const blockStartMillis = blockStart.getTime();
			const blockEndMillis = blockEnd.getTime();

			console.log(startMillis < blockStartMillis && endMillis > blockStartMillis);
			console.log(startMillis < blockEndMillis && endMillis > blockEndMillis);
			console.log(startMillis > blockStartMillis && endMillis < blockEndMillis);
			if (
				(startMillis < blockStartMillis && endMillis > blockStartMillis) ||
				(startMillis < blockEndMillis && endMillis > blockEndMillis) ||
				(startMillis > blockStartMillis && endMillis < blockEndMillis)
			) {
				error(400, { message: "Invalid input: times conflict with existing block" });
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
			deleteAppointmentBlocks(mergeableBlocks.map(block => block.id));
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
		await createAppointmentBlock(params.memberID, dayOfWeek, start, duration);
		redirect(303, `/courses/${params.courseID}/sections/${params.sectionID}`);
	}
};
