import type { QueryConfig, QueryResult, PoolClient } from "pg";
import { withConnection } from "./index";
import type { SectionMember } from "../types";

export async function getUsersSectionMembers(userId: string): Promise<SectionMember[] | undefined> {
	return withConnection(async (client) => {
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
