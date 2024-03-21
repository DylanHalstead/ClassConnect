import { v4 as uuidv4 } from "uuid";
import type { QueryConfig, QueryResult, PoolClient } from "pg";
import { withConnection } from "./index";
import type { AppointmentBlock, PostgresAppointmentBlock, WeekDay } from "../types";
import {
	postgresTimeWithTimeZoneToDate,
	intervalToMilliseconds,
	dateToPostgresTimeWithTimeZone,
	millisecondsToIntervalString
} from "../utils";

export async function getAppointmentBlock(id: string): Promise<AppointmentBlock | undefined> {
	return withConnection(async (client: PoolClient) => {
		const query: QueryConfig = {
			text: "SELECT ab.id, ab.start_time, ab.end_time, ab.notes FROM appointment_blocks ab WHERE id = $1",
			values: [id]
		};

		const res: QueryResult<PostgresAppointmentBlock> = await client.query(query);
		if (res.rows.length === 0) {
			return undefined;
		}

		const row = res.rows[0];
		return {
			id: row.id,
			instructional_member_id: row.instructional_member_id,
			week_day: row.week_day,
			start_time: postgresTimeWithTimeZoneToDate(row.start_time),
			duration: intervalToMilliseconds(row.duration)
		};
	});


}

export async function getSectionsAppointmentBlocks(sectionId: string): Promise<AppointmentBlock[] | undefined> {
	return withConnection(async (client: PoolClient) => {
		const query: QueryConfig = {
			text: "SELECT ab.id, ab.instructional_member_id, ab.week_day, ab.start_time, ab.duration FROM appointment_blocks ab JOIN section_members sm ON ab.instructional_member_id = sm.id WHERE sm.section_id = $1",
			values: [sectionId]
		};

		const res: QueryResult<PostgresAppointmentBlock> = await client.query(query);
		if (res.rows.length === 0) {
			return undefined;
		}
		const appointmentBlocks = res.rows.map(row => {
			const appointmentBlock: AppointmentBlock = {
				id: row.id,
				instructional_member_id: row.instructional_member_id,
				week_day: row.week_day,
				start_time: postgresTimeWithTimeZoneToDate(row.start_time),
				duration: intervalToMilliseconds(row.duration)
			};
			return appointmentBlock;
		});
		return appointmentBlocks;
	});
}

export async function getMembersAppointmentBlocks(memberId: string): Promise<AppointmentBlock[] | undefined> {
	return withConnection(async (client: PoolClient) => {
		const query: QueryConfig = {
			text: "SELECT id, instructional_member_id, week_day, start_time, duration FROM appointment_blocks WHERE instructional_member_id = $1",
			values: [memberId]
		};

		const res: QueryResult<PostgresAppointmentBlock> = await client.query(query);
		if (res.rows.length === 0) {
			return undefined;
		}
		
		const appointmentBlocks = res.rows.map(row => {
			const appointmentBlock: AppointmentBlock = {
				id: row.id,
				instructional_member_id: row.instructional_member_id,
				week_day: row.week_day,
				start_time: postgresTimeWithTimeZoneToDate(row.start_time),
				duration: intervalToMilliseconds(row.duration)
			};
			return appointmentBlock;
		});
		return appointmentBlocks;
	});
}

export async function createAppointmentBlock(
	instructionalMemberId: string,
	weekDay: WeekDay,
	startTime: Date,
	duration: number
): Promise<AppointmentBlock | undefined> {
	return withConnection(async (client: PoolClient) => {
		const query: QueryConfig = {
			text: "INSERT INTO appointment_blocks (id, instructional_member_id, week_day, start_time, duration) VALUES ($1, $2, $3, $4, $5) RETURNING appointment_blocks.id, appointment_blocks.instructional_member_id, appointment_blocks.week_day, appointment_blocks.start_time, appointment_blocks.duration",
			values: [
				uuidv4(),
				instructionalMemberId,
				weekDay,
				dateToPostgresTimeWithTimeZone(startTime),
				millisecondsToIntervalString(duration)
			]
		};

		try {
			const res: QueryResult<PostgresAppointmentBlock> = await client.query(query);
			const appointmentBlock = res.rows.map(row => {
				const appointmentBlock: AppointmentBlock = {
					id: row.id,
					instructional_member_id: row.instructional_member_id,
					week_day: row.week_day,
					start_time: postgresTimeWithTimeZoneToDate(row.start_time),
					duration: intervalToMilliseconds(row.duration)
				};
				return appointmentBlock;
			})[0];
			return appointmentBlock;
		} catch (error) {
			return undefined;
		}
	});
}

export async function deleteAppointmentBlocks(ids: string[]): Promise<void> {
	return withConnection(async (client: PoolClient) => {
		const query: QueryConfig = {
			text: "DELETE FROM appointment_blocks WHERE id = ANY($1)",
			values: [ids]
		};

		await client.query(query);
	});
}
