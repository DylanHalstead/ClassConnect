import { withConnection } from "$lib/db";
import { extendAppointmentBlocks, getAppointmentBlocks } from "$lib/db/appointmentBlocks";
import { extendSectionMembers, getSectionMembers } from "$lib/db/sectionMembers";
import {
	type Appointment,
	type ExtendedAppointment,
	isSectionMemberStudent,
	type PartialAppointment
} from "$lib/types";
import { randomUUID } from "crypto";
import type { QueryConfig, QueryResult } from "pg";

export async function createAppointment(
	partialAppointment: PartialAppointment
): Promise<Appointment> {
	return withConnection(async client => {
		const newAppointment: Appointment = {
			...partialAppointment,

			id: randomUUID()
		};

		const query: QueryConfig = {
			text: `
				INSERT INTO appointments (id, appointment_day, appointment_block, student_id, cancelled, link)
				VALUES ($1, $2, $3, $4, $5, $6)
			`,
			values: [
				newAppointment.id,
				newAppointment.appointment_day.toLocaleDateString(),
				newAppointment.appointment_block,
				newAppointment.student_id,
				newAppointment.cancelled,
				newAppointment.link
			]
		};

		await client.query(query);

		return newAppointment;
	});
}

export async function extendAppointments(
	appointments: Appointment[]
): Promise<ExtendedAppointment[] | Error> {
	const appointmentBlocks = await getAppointmentBlocks(
		appointments.map(appointment => appointment.appointment_block)
	);

	if (appointmentBlocks instanceof Error) {
		return appointmentBlocks;
	}

	const extendedAppointmentBlocks = await extendAppointmentBlocks(appointmentBlocks);

	if (extendedAppointmentBlocks instanceof Error) {
		return extendedAppointmentBlocks;
	}

	const studentIds = appointments.map(appointment => appointment.student_id);
	const students = await getSectionMembers(studentIds);

	if (students == undefined) {
		return new Error(`Couldn't find the students with the IDs ${studentIds}`);
	}

	const extendedStudents = await extendSectionMembers(students);

	if (extendedStudents instanceof Error) {
		return extendedStudents;
	}

	const result: ExtendedAppointment[] = [];

	for (const [i, appointment] of appointments.entries()) {
		const appointmentBlock = extendedAppointmentBlocks[i];
		const student = extendedStudents[i];

		if (appointmentBlock == undefined || student == undefined || !isSectionMemberStudent(student)) {
			return new Error(`I didn't get back a student with the ID ${appointment.student_id}`);
		}

		result.push({
			...appointment,

			appointment_block: appointmentBlock,
			student
		});
	}

	return result;
}

export async function getAppointmentBlocksAppointments(ids: string[]): Promise<Appointment[]> {
	if (ids.length == 0) {
		return [];
	}

	return withConnection(async client => {
		const query: QueryConfig = {
			text: `
SELECT id, appointment_day, appointment_block, student_id, cancelled, link
FROM appointments
WHERE appointment_block = ANY($1)`,

			values: [ids]
		};

		const result: QueryResult<Appointment> = await client.query(query);

		return result.rows;
	});
}

export async function getStudentsAppointments(ids: string[]): Promise<Appointment[]> {
	if (ids.length == 0) {
		return [];
	}

	return withConnection(async client => {
		const query: QueryConfig = {
			text: `
SELECT id, appointment_day, appointment_block, student_id, cancelled, link
FROM appointments
WHERE student_id = ANY($1)`,

			values: [ids]
		};

		const result: QueryResult<Appointment> = await client.query(query);

		return result.rows;
	});
}
