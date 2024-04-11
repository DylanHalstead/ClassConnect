import { withConnection } from "$lib/db";
import { extendSectionMembers, getSectionMembers } from "$lib/db/sectionMembers";
import {
	type AppointmentBlock,
	type ExtendedAppointmentBlock,
	isSectionMemberInstructionalMember,
	type PartialAppointmentBlock,
	type PostgresAppointmentBlock
} from "$lib/types";
import { postgresAppointmentBlockToAppointmentBlock } from "$lib/utils";
import { randomUUID } from "crypto";
import type { QueryConfig, QueryResult } from "pg";

export async function createAppointmentBlock(
	partialAppointmentBlock: PartialAppointmentBlock
): Promise<AppointmentBlock> {
	return withConnection(async client => {
		const newAppointmentBlock: AppointmentBlock = {
			...partialAppointmentBlock,

			id: randomUUID()
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
	if (ids.length == 0) {
		return true;
	}

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

export async function extendAppointmentBlocks(
	appointmentBlocks: AppointmentBlock[]
): Promise<ExtendedAppointmentBlock[] | undefined> {
	const instructionalMembers = await getSectionMembers(
		appointmentBlocks.map(appointmentBlock => appointmentBlock.id)
	);

	if (instructionalMembers == undefined) {
		return;
	}

	const extendedInstructionalMembers = await extendSectionMembers(instructionalMembers);

	if (extendedInstructionalMembers == undefined) {
		return;
	}

	const result: ExtendedAppointmentBlock[] = [];

	for (const [i, appointmentBlock] of appointmentBlocks.entries()) {
		const instructionalMember = extendedInstructionalMembers[i];

		if (
			instructionalMember == undefined ||
			!isSectionMemberInstructionalMember(instructionalMember)
		) {
			return;
		}

		result.push({
			...appointmentBlock,

			instructional_member: instructionalMember
		});
	}

	return result;
}

export async function getAppointmentBlocks(ids: string[]): Promise<AppointmentBlock[] | undefined> {
	if (ids.length == 0) {
		return [];
	}

	return withConnection(async client => {
		const query: QueryConfig = {
			text: `
SELECT id, instructional_member_id, week_day, start_time, duration
FROM appointment_blocks
WHERE id = ANY($1)`,

			values: [ids]
		};

		const queryResult: QueryResult<PostgresAppointmentBlock> = await client.query(query);
		const appointmentBlocks = new Map();

		for (const row of queryResult.rows) {
			const appointmentBlock = postgresAppointmentBlockToAppointmentBlock(row);

			if (appointmentBlock == undefined) {
				return;
			}

			appointmentBlocks.set(appointmentBlock.id, appointmentBlock);
		}

		const result: AppointmentBlock[] = [];

		for (const id of ids) {
			const appointmentBlock = appointmentBlocks.get(id);

			if (appointmentBlock == undefined) {
				return;
			}

			result.push(appointmentBlock);
		}

		return result;
	});
}

export async function getSectionMembersAppointmentBlocks(
	ids: string[]
): Promise<AppointmentBlock[] | undefined> {
	if (ids.length == 0) {
		return [];
	}

	return withConnection(async client => {
		const query: QueryConfig = {
			text: `
SELECT id, instructional_member_id, week_day, start_time, duration
FROM appointment_blocks
WHERE instructional_member_id = ANY($1)`,
			values: [ids]
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
