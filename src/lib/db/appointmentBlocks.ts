import { withConnection } from "$lib/db";
import { extendSectionMembers, getSectionMembers } from "$lib/db/sectionMembers";
import {
	type AppointmentBlock,
	type ExtendedAppointmentBlock,
	type PartialAppointmentBlock,
	type PostgresAppointmentBlock,
	isSectionMemberInstructionalMember
} from "$lib/types";
import { bulkQuery, postgresAppointmentBlockToAppointmentBlock } from "$lib/utils";
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
): Promise<ExtendedAppointmentBlock[] | Error> {
	const instructionalMemberIds = appointmentBlocks.map(
		appointmentBlock => appointmentBlock.instructional_member_id
	);

	const instructionalMembers = await getSectionMembers(instructionalMemberIds);

	if (instructionalMembers == undefined) {
		return new Error(
			`Couldn't find the instructional members with the IDs ${instructionalMemberIds}`
		);
	}

	const extendedInstructionalMembers = await extendSectionMembers(instructionalMembers);

	if (extendedInstructionalMembers instanceof Error) {
		return extendedInstructionalMembers;
	}

	const result: ExtendedAppointmentBlock[] = [];

	for (const [i, appointmentBlock] of appointmentBlocks.entries()) {
		const instructionalMember = extendedInstructionalMembers[i];

		if (
			instructionalMember == undefined ||
			!isSectionMemberInstructionalMember(instructionalMember)
		) {
			return new Error(
				`I didn't get back an instructional member with the ID ${appointmentBlock.instructional_member_id}`
			);
		}

		result.push({
			...appointmentBlock,

			instructional_member: instructionalMember
		});
	}

	return result;
}

export async function getAppointmentBlocks(ids: string[]): Promise<AppointmentBlock[] | Error> {
	return (
		(await bulkQuery(ids, () =>
			withConnection(async client => {
				const query: QueryConfig = {
					text: `
SELECT id, instructional_member_id, week_day, start_time, duration
FROM appointment_blocks
WHERE id = ANY($1)`,

					values: [ids]
				};

				const queryResult: QueryResult<PostgresAppointmentBlock> = await client.query(query);

				const result: AppointmentBlock[] = [];

				for (const row of queryResult.rows) {
					const appointmentBlock = postgresAppointmentBlockToAppointmentBlock(row);

					if (appointmentBlock instanceof Error) {
						return appointmentBlock;
					}

					result.push(appointmentBlock);
				}

				return result;
			})
		)) ?? new Error(`Couldn't find appointment blocks with the IDs ${ids}`)
	);
}

export async function getSectionMembersAppointmentBlocks(
	ids: string[]
): Promise<AppointmentBlock[] | Error> {
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
			if (appointmentBlock instanceof Error) {
				return appointmentBlock;
			}

			filtered.push(appointmentBlock);
		}

		return filtered;
	});
}

export async function getSectionsAppointmentBlocks(
	sectionId: string
): Promise<AppointmentBlock[] | Error> {
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
			if (appointmentBlock instanceof Error) {
				return appointmentBlock;
			}

			filtered.push(appointmentBlock);
		}

		return filtered;
	});
}
