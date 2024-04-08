import { SECRET_GCP_CLIENT_ID, SECRET_GCP_CLIENT_SECRET } from "$env/static/private";
import { withConnection } from "$lib/db";
import { createAppointmentBlock } from "$lib/db/appointmentBlocks";
import { createAppointment } from "$lib/db/appointments";
import { createCourse } from "$lib/db/courses";
import { createSectionMember } from "$lib/db/sectionMembers";
import { createSection } from "$lib/db/sections";
import { createUser } from "$lib/db/users";
import { SectionMemberType, WeekDay } from "$lib/types";
import type { Handle } from "@sveltejs/kit";
import type { QueryConfig } from "pg";
import { SvelteGoogleAuthHook } from "svelte-google-auth/server";

const auth = new SvelteGoogleAuthHook({
	client_id: SECRET_GCP_CLIENT_ID,
	client_secret: SECRET_GCP_CLIENT_SECRET
});

export const handle: Handle = async ({ event, resolve }) => {
	return await auth.handleAuth({ event, resolve });
};

async function initializeDatabase() {
	const initialized = await withConnection(async client => {
		const query: QueryConfig = {
			text: "SELECT initialized FROM initialized"
		};

		return (await client.query(query)).rows.length > 0;
	});

	if (initialized) {
		return;
	}

	await withConnection(async client => {
		const query: QueryConfig = {
			text: "INSERT INTO initialized VALUES (TRUE)"
		};

		await client.query(query);
	});

	const course = await createCourse({
		department_code: "ITSC",
		course_code: "3155",
		course_name: "Software Engineering"
	});

	const instructionalMemberUser = await createUser({
		email: "jadenpeterson150@gmail.com",
		first_name: "Jaden",
		last_name: "Peterson"
	});

	const studentUser = await createUser({
		email: "dhalstea@uncc.edu",
		first_name: "Dylan",
		last_name: "Halstead"
	});

	const section = await createSection({
		course_id: course.id,
		section_number: 3155,
		max_daily_bookable_hours: Infinity
	});

	const instructionalMember = await createSectionMember({
		section_id: section.id,
		user_id: instructionalMemberUser.id,
		member_type: SectionMemberType.TA,
		is_restricted: false
	});

	const student = await createSectionMember({
		section_id: section.id,
		user_id: studentUser.id,
		member_type: SectionMemberType.Student,
		is_restricted: false
	});

	const appointmentBlock1Time = new Date();

	appointmentBlock1Time.setDate(appointmentBlock1Time.getDate() - appointmentBlock1Time.getDay());
	appointmentBlock1Time.setHours(9, 0, 0, 0);

	const appointmentBlock2Time = new Date(appointmentBlock1Time);

	appointmentBlock2Time.setDate(appointmentBlock1Time.getDate() + 1);

	const appointmentBlock1 = await createAppointmentBlock({
		instructional_member_id: instructionalMember.id,
		week_day: WeekDay.Sunday,
		start_time: appointmentBlock1Time,
		duration: 1000 * 60 * 30
	});

	const appointmentBlock2 = await createAppointmentBlock({
		...appointmentBlock1,

		week_day: WeekDay.Tuesday,
		start_time: appointmentBlock2Time
	});

	const appointment1 = await createAppointment({
		appointment_day: appointmentBlock1Time,
		appointment_block: appointmentBlock1.id,
		student_id: student.id,
		cancelled: false,
		link: ""
	});

	await createAppointment({
		...appointment1,

		appointment_day: appointmentBlock2Time,
		appointment_block: appointmentBlock2.id
	});
}

initializeDatabase();
