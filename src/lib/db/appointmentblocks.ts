import type { QueryConfig } from "pg";
import { v4 as uuidv4 } from "uuid";
import type { AppointmentBlock, PartialAppointmentBlock } from "$lib/types";
import { withConnection } from ".";

export async function createAppointmentBlock(
	partialAppointmentBlock: PartialAppointmentBlock
): Promise<AppointmentBlock> {
	return withConnection(async client => {
		const newAppointmentBlock: AppointmentBlock = {
			...partialAppointmentBlock,

			id: uuidv4()
		};

		const query: QueryConfig = {
			text: `
INSERT INTO appointment_blocks (id, instructional_member_id, week_day, start_time, duration)
VALUES ($1, $2, $3, $4, $5)`,
			values: [
				newAppointmentBlock.id,
				newAppointmentBlock.instructional_member_id,
				newAppointmentBlock.week_day,
				newAppointmentBlock.start_time.toLocaleTimeString(),
				newAppointmentBlock.duration
			]
		};

		await client.query(query);

		return newAppointmentBlock;
	});
}
