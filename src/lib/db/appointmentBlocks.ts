import { v4 as uuidv4 } from "uuid";
import type { QueryConfig, QueryResult, PoolClient } from "pg";
import { withConnection } from "./index";
import type { AppointmentBlock, PostgresAppointmentBlock, WeekDay } from "../types";
import {
	dateToPostgresTimeWithTimeZone,
	millisecondsToIntervalString, 
	postgresAppointmentBlockToAppointmentBlock
} from "../utils";

export async function getAppointmentBlock(id: string): Promise<AppointmentBlock | undefined> {
	return withConnection(async (client) => {
		const query: QueryConfig = {
			text: "SELECT ab.id, ab.start_time, ab.end_time, ab.notes FROM appointment_blocks ab WHERE id = $1",
			values: [id]
		};

		const res: QueryResult<PostgresAppointmentBlock> = await client.query(query);
		if (res.rows.length === 0) {
			return undefined;
		}
		const row = res.rows[0];
		return postgresAppointmentBlockToAppointmentBlock(row);
	});


}

export async function getSectionsAppointmentBlocks(sectionId: string): Promise<AppointmentBlock[] | undefined> {
	return withConnection(async (client) => {
		const query: QueryConfig = {
			text: "SELECT ab.id, ab.instructional_member_id, ab.week_day, ab.start_time, ab.duration FROM appointment_blocks ab JOIN section_members sm ON ab.instructional_member_id = sm.id WHERE sm.section_id = $1",
			values: [sectionId]
		};

		const res: QueryResult<PostgresAppointmentBlock> = await client.query(query);
		if (res.rows.length === 0) {
			return undefined;
		}
		const appointmentBlocks = res.rows.map(row => {
			return postgresAppointmentBlockToAppointmentBlock(row);
		});
		return appointmentBlocks;
	});
}

export async function getMembersAppointmentBlocks(memberId: string): Promise<AppointmentBlock[] | undefined> {
	return withConnection(async (client) => {
		const query: QueryConfig = {
			text: "SELECT ab.id, ab.instructional_member_id, ab.week_day, ab.start_time, ab.duration FROM appointment_blocks ab WHERE ab.instructional_member_id = $1",
			values: [memberId]
		};

		const res: QueryResult<PostgresAppointmentBlock> = await client.query(query);
		if (res.rows.length === 0) {
			return undefined;
		}
		const appointmentBlocks = res.rows.map(row => {
			return postgresAppointmentBlockToAppointmentBlock(row);
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
	return withConnection(async (client) => {
		const query: QueryConfig = {
			text: "INSERT INTO appointment_blocks AS ab (id, instructional_member_id, week_day, start_time, duration) VALUES ($1, $2, $3, $4, $5) RETURNING ab.id, ab.instructional_member_id, ab.week_day, ab.start_time, ab.duration",
			values: [
				uuidv4(),
				instructionalMemberId,
				weekDay,
				dateToPostgresTimeWithTimeZone(startTime),
				millisecondsToIntervalString(duration)
			]
		};

		const res: QueryResult<PostgresAppointmentBlock> = await client.query(query);
		const row = res.rows[0];
		return postgresAppointmentBlockToAppointmentBlock(row);
	});
}

export async function deleteAppointmentBlocks(ids: string[]): Promise<void | undefined> {
	return withConnection(async (client) => {
		const query: QueryConfig = {
			text: "DELETE FROM appointment_blocks WHERE id = ANY($1)",
			values: [ids]
		};

		await client.query(query);
	});
}
