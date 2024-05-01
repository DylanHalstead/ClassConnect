import {
	SECRET_GCP_CLIENT_ID,
	SECRET_GCP_CLIENT_SECRET,
	SECRET_NODE_ENV
} from "$env/static/private";
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

	const course2 = await createCourse({
		department_code: "ITSC",
		course_code: "2202",
		course_name: "Computer Programming II"
	});

	const instructionalMemberUser = await createUser({
		email: "jadenpeterson150@gmail.com",
		first_name: "Jaden",
		last_name: "Peterson"
	});

	const instructionalMemberUser2 = await createUser({
		email: "dylanhalstea11@gmail.com",
		first_name: "Dylan",
		last_name: "Halstead"
	});

	const studentUser = await createUser({
		email: "dhalstea@uncc.edu",
		first_name: "Dylan",
		last_name: "Halstead"
	});

	const studentUser2 = await createUser({
		email: "j.anderson2429@gmail.com",
		first_name: "James",
		last_name: "Anderson"
	});

	const section = await createSection({
		course_id: course.id,
		section_number: 1,
		max_daily_bookable_hours: Infinity
	});

	const section2 = await createSection({
		course_id: course2.id,
		section_number: 2202,
		max_daily_bookable_hours: Infinity
	});

	const instructionalMember = await createSectionMember({
		section_id: section.id,
		user_id: instructionalMemberUser.id,
		member_type: SectionMemberType.TA,
		is_restricted: false
	});

	const instructionalMember2 = await createSectionMember({
		section_id: section.id,
		user_id: instructionalMemberUser2.id,
		member_type: SectionMemberType.TA,
		is_restricted: false
	});

	const instructionalMember3 = await createSectionMember({
		section_id: section2.id,
		user_id: studentUser2.id,
		member_type: SectionMemberType.TA,
		is_restricted: false
	});

	const student = await createSectionMember({
		section_id: section.id,
		user_id: studentUser.id,
		member_type: SectionMemberType.Student,
		is_restricted: false
	});

	const student2 = await createSectionMember({
		section_id: section.id,
		user_id: studentUser2.id,
		member_type: SectionMemberType.Student,
		is_restricted: false
	});

	const student3 = await createSectionMember({
		section_id: section2.id,
		user_id: studentUser.id,
		member_type: SectionMemberType.Student,
		is_restricted: false
	});

	const appointmentBlock1Time = new Date();

	appointmentBlock1Time.setDate(appointmentBlock1Time.getDate() - appointmentBlock1Time.getDay());
	appointmentBlock1Time.setHours(9, 0, 0, 0);

	const appointmentBlock2Time = new Date(appointmentBlock1Time);

	appointmentBlock2Time.setDate(appointmentBlock1Time.getDate() + 2);

	const appointmentBlock3Time = new Date(appointmentBlock2Time);
	appointmentBlock3Time.setDate(appointmentBlock2Time.getDate() + 2);

	const appointmentBlock4Time = new Date(appointmentBlock3Time);
	appointmentBlock4Time.setDate(appointmentBlock3Time.getDate() + 1);

	const appointmentBlock5Time = new Date(appointmentBlock1Time);
	appointmentBlock5Time.setDate(appointmentBlock1Time.getDate());

	const appointmentBlock1 = await createAppointmentBlock({
		instructional_member_id: instructionalMember.id,
		week_day: WeekDay.Sunday,
		start_time: appointmentBlock1Time,
		duration: 1000 * 60 * 30
	});

	const appointmentBlock2 = await createAppointmentBlock({
		instructional_member_id: instructionalMember.id,
		week_day: WeekDay.Tuesday,
		start_time: appointmentBlock2Time,
		duration: 1000 * 60 * 30
	});

	const appointmentBlock3 = await createAppointmentBlock({
		instructional_member_id: instructionalMember.id,
		week_day: WeekDay.Thursday,
		start_time: appointmentBlock2Time,
		duration: 1000 * 60 * 30
	});

	const appointmentBlock4 = await createAppointmentBlock({
		instructional_member_id: instructionalMember2.id,
		week_day: WeekDay.Friday,
		start_time: appointmentBlock2Time,
		duration: 1000 * 60 * 30
	});

	const appointmentBlock5 = await createAppointmentBlock({
		instructional_member_id: instructionalMember3.id,
		week_day: WeekDay.Wednesday,
		start_time: appointmentBlock5Time,
		duration: 1000 * 60 * 30
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

	const appointment2 = await createAppointment({
		appointment_day: appointmentBlock3Time,
		appointment_block: appointmentBlock3.id,
		student_id: student2.id,
		cancelled: false,
		link: ""
	});

	await createAppointment({
		...appointment2,

		appointment_day: appointmentBlock4Time,
		appointment_block: appointmentBlock4.id
	});

	await createAppointment({
		appointment_day: appointmentBlock5Time,
		appointment_block: appointmentBlock5.id,
		student_id: student3.id,
		cancelled: false,
		link: ""
	});
}

if (SECRET_NODE_ENV === "development") {
	initializeDatabase();
}
