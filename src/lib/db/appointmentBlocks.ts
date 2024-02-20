import { v4 as uuidv4 } from 'uuid';
import type { QueryConfig, QueryResult, PoolClient } from 'pg';
import { withConnection } from './index'; 
import type { AppointmentBlock, PostgresAppointmentBlock, WeekDay, Interval } from "../types";
import { intervalToString, parseTimeWithTimeZone } from '../utils';

export async function getAppointmentBlock(id: string): Promise<AppointmentBlock>{
  return withConnection(async (client: PoolClient) => {
    const query: QueryConfig = {
      text: 'SELECT appointment_blocks.id, appointment_blocks.start_time, appointment_blocks.end_time, appointment_blocks.notes FROM appointment_blocks WHERE id = $1',
      values: [id],
    };

    const res: QueryResult<PostgresAppointmentBlock> = await client.query(query);
    const appointmentBlocks = res.rows.map((row) => {
      const appointmentBlock: AppointmentBlock = {
        id: row.id,
        instructional_member_id: row.instructional_member_id,
        week_day: row.week_day,
        start_time: parseTimeWithTimeZone(row.start_time),
        duration: row.duration
        };
      return appointmentBlock;
    })[0];
    return appointmentBlocks;
  });
}

export async function getSectionsAppointmentBlocks(sectionId: string): Promise<AppointmentBlock[]>{
  return withConnection(async (client: PoolClient) => {
    const query: QueryConfig = {
      text: 'SELECT ab.id, ab.instructional_member_id, ab.week_day, ab.start_time, ab.duration FROM appointment_blocks ab JOIN section_members sm ON ab.instructional_member_id = sm.id WHERE sm.section_id = $1',
      values: [sectionId],
    };

    const res: QueryResult<PostgresAppointmentBlock> = await client.query(query);
    const appointmentBlocks = res.rows.map((row) => {
      const appointmentBlock: AppointmentBlock = {
        id: row.id,
        instructional_member_id: row.instructional_member_id,
        week_day: row.week_day,
        start_time: parseTimeWithTimeZone(row.start_time),
        duration: row.duration
        };
      return appointmentBlock;
    });
    return appointmentBlocks;
  });
}

export async function getMembersAppointmentBlocks(memberId: string): Promise<AppointmentBlock[]>{
  return withConnection(async (client: PoolClient) => {
    const query: QueryConfig = {
      text: 'SELECT id, instructional_member_id, week_day, start_time, duration FROM appointment_blocks WHERE instructional_member_id = $1',
      values: [memberId],
    };

    const res: QueryResult<PostgresAppointmentBlock> = await client.query(query);
    const appointmentBlocks = res.rows.map((row) => {
      const appointmentBlock: AppointmentBlock = {
        id: row.id,
        instructional_member_id: row.instructional_member_id,
        week_day: row.week_day,
        start_time: parseTimeWithTimeZone(row.start_time),
        duration: row.duration
        };
      return appointmentBlock;
    });
    return appointmentBlocks;
  });
}

export async function createAppointmentBlock(instructionalMemberId: string, weekDay: WeekDay, startTime: Date, duration: Interval): Promise<AppointmentBlock>{
  return withConnection(async (client: PoolClient) => {
    const newAppointmentBlock: AppointmentBlock = {
      id: uuidv4(),
      instructional_member_id: instructionalMemberId,
      week_day: weekDay,
      start_time: startTime,
      duration: duration
    }

    const query: QueryConfig = {
      text: 'INSERT INTO appointment_blocks (id, instructional_member_id, week_day, start_time, duration) VALUES ($1, $2, $3, $4, $5) RETURNING appointment_blocks.id, appointment_blocks.instructional_member_id, appointment_blocks.week_day, appointment_blocks.start_time, appointment_blocks.duration',
      values: [newAppointmentBlock.id, newAppointmentBlock.instructional_member_id, newAppointmentBlock.week_day, newAppointmentBlock.start_time.toLocaleTimeString(), intervalToString(newAppointmentBlock.duration)],
    }

    const res: QueryResult<AppointmentBlock> = await client.query(query);
    const appointmentBlock = res.rows[0];
    return appointmentBlock;
  });
}
