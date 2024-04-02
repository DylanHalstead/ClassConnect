import type { QueryConfig, QueryResult } from "pg";
import { v4 as uuidv4 } from "uuid";
import type { PartialSectionMember, SectionMember } from "$lib/types";
import { withConnection } from ".";

export async function createSectionMember(
	partialSectionMember: PartialSectionMember
): Promise<SectionMember> {
	return withConnection(async client => {
		const newSectionMember: SectionMember = {
			...partialSectionMember,

			id: uuidv4()
		};

		const query: QueryConfig = {
			text: `
INSERT INTO section_members (id, section_id, user_id, member_type, is_restricted)
VALUES ($1, $2, $3, $4, $5)`,
			values: [
				newSectionMember.id,
				newSectionMember.section_id,
				newSectionMember.user_id,
				newSectionMember.member_type,
				newSectionMember.is_restricted
			]
		};

		await client.query(query);

		return newSectionMember;
	});
}

export async function getUsersSectionMembers(userId: string): Promise<SectionMember[]> {
	return withConnection(async client => {
		const query: QueryConfig = {
			text: "SELECT sm.id, sm.section_id, sm.user_id, sm.member_type, sm.is_restricted FROM section_members sm WHERE sm.user_id = $1",
			values: [userId]
		};

		const result: QueryResult<SectionMember> = await client.query(query);

		return result.rows;
	});
}
