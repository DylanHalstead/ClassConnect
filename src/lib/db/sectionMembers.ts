import type { QueryConfig, QueryResult, PoolClient } from "pg";
import { withConnection } from "./index";
import type { SectionMember } from "../types";

export async function getUsersSectionMembers(userId: string): Promise<SectionMember[] | undefined> {
	return withConnection(async (client: PoolClient) => {
		const query: QueryConfig = {
			text: "SELECT * FROM section_members WHERE user_id = $1",
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
