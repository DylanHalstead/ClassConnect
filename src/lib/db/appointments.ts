import type { QueryConfig } from "pg";
import { randomUUID } from "crypto";
import type { Appointment, PartialAppointment } from "$lib/types";
import { withConnection } from ".";

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
VALUES ($1, $2, $3, $4, $5, $6)`,
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
