import type { QueryConfig, QueryResult } from "pg";
import { v4 as uuidv4 } from "uuid";
import type {
	AppointmentBlock,
	PartialAppointmentBlock,
	PostgresAppointmentBlock
} from "$lib/types";

import { postgresAppointmentBlockToAppointmentBlock } from "../utils";
import { withConnection } from "./index";

export async function getAppointmentBlock(id: string): Promise<AppointmentBlock | undefined> {
	return withConnection(async client => {
		const query: QueryConfig = {
			text: `
				SELECT
					ab.id,
					ab.instructional_member_id,
					ab.week_day,
					ab.start_time,
					ab.duration
				FROM appointment_blocks ab
				WHERE id = $1
			`,
			values: [id]
		};

		const result: QueryResult<PostgresAppointmentBlock> = await client.query(query);
		const row = result.rows[0];

		if (row == undefined) {
			return undefined;
		}

		return postgresAppointmentBlockToAppointmentBlock(row);
	});
}

export async function getSectionsAppointmentBlocks(
	sectionId: string
): Promise<AppointmentBlock[] | undefined> {
	return withConnection(async client => {
		const query: QueryConfig = {
			text: `
				SELECT ab.id,
					ab.instructional_member_id,
					ab.week_day,
					ab.start_time,
					ab.duration
				FROM appointment_blocks ab 
					JOIN section_members sm 
							ON ab.instructional_member_id = sm.id
				WHERE sm.section_id = $1
			`,
			values: [sectionId]
		};

		const result: QueryResult<PostgresAppointmentBlock> = await client.query(query);
		const appointmentBlocks = result.rows.map(row =>
			postgresAppointmentBlockToAppointmentBlock(row)
		);

		const filtered: AppointmentBlock[] = [];

		for (const appointmentBlock of appointmentBlocks) {
			if (appointmentBlock == undefined) {
				return;
			}

			filtered.push(appointmentBlock);
		}

		return filtered;
	});
}

export async function getMembersAppointmentBlocks(
	memberId: string
): Promise<AppointmentBlock[] | undefined> {
	return withConnection(async client => {
		const query: QueryConfig = {
			text: `
				SELECT ab.id,
					ab.instructional_member_id,
					ab.week_day,
					ab.start_time,
					ab.duration
				FROM appointment_blocks ab
				WHERE ab.instructional_member_id = $1
			`,
			values: [memberId]
		};

		const result: QueryResult<PostgresAppointmentBlock> = await client.query(query);
		const appointmentBlocks = result.rows.map(row => {
			return postgresAppointmentBlockToAppointmentBlock(row);
		});

		const filtered: AppointmentBlock[] = [];

		for (const appointmentBlock of appointmentBlocks) {
			if (appointmentBlock == undefined) {
				return;
			}

			filtered.push(appointmentBlock);
		}

		return filtered;
	});
}

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
				VALUES ($1, $2, $3, $4, $5)
			`,
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

export async function deleteAppointmentBlocks(ids: string[]): Promise<boolean> {
	return withConnection(async client => {
		const uniqueIds = new Set(ids);
		const query: QueryConfig = {
			text: `DELETE FROM appointment_blocks WHERE id = ANY($1)`,
			values: [uniqueIds]
		};

		const result = await client.query(query);

		return result.rowCount == uniqueIds.size;
	});
}
