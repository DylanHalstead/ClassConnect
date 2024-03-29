import type { QueryConfig, QueryResult } from "pg";
import { withConnection } from "./index";
import type { ExtendedSectionMember, FlatExtendedSectionMember, SectionMember } from "../types";
import { flatExtendedSectionMemberToExtendedSectionMember } from "../utils";

export async function getUsersSectionMembers(userId: string): Promise<SectionMember[] | undefined> {
	return withConnection(async client => {
		const query: QueryConfig = {
			text: "SELECT sm.id, sm.section_id, sm.user_id, sm.member_type, sm.is_restricted FROM section_members sm WHERE sm.user_id = $1",
			values: [userId]
		};

		const res: QueryResult<SectionMember> = await client.query(query);
		const sectionMembers = res.rows;
		if (sectionMembers.length === 0) {
			return undefined;
		}
		return sectionMembers;
	});
}

export async function getSectionMembers(sectionId: string): Promise<SectionMember[] | undefined> {
	return withConnection(async client => {
		const query: QueryConfig = {
			text: "SELECT sm.id, sm.section_id, sm.user_id, sm.member_type, sm.is_restricted FROM section_members sm WHERE sm.section_id = $1",
			values: [sectionId]
		};

		const res: QueryResult<SectionMember> = await client.query(query);
		const sectionMembers = res.rows;
		if (sectionMembers.length === 0) {
			return undefined;
		}
		return sectionMembers;
	});
}

export async function getExtendedSectionMembers(sectionId: string): Promise<ExtendedSectionMember[] | undefined> {
	return withConnection(async client => {
		const query: QueryConfig = {
			text: "SELECT sm.id, sm.section_id, sm.user_id, sm.member_type, sm.is_restricted, u.email, u.first_name, u.last_name, s.course_id, s.max_daily_bookable_hours, c.department_code, c.course_code, c.course_name FROM section_members sm JOIN users u ON sm.user_id = u.id JOIN sections s ON sm.section_id = s.id JOIN courses c ON s.course_id = c.id WHERE sm.section_id = $1",
			values: [sectionId]
		};

		const res: QueryResult<FlatExtendedSectionMember> = await client.query(query);
		if (res.rows.length === 0) {
			return undefined;
		}
		const extendedSectionMembers = res.rows.map(row => flatExtendedSectionMemberToExtendedSectionMember(row));
		return extendedSectionMembers;
	});
}