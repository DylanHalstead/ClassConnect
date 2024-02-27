import type { QueryConfig, QueryResult, PoolClient } from "pg";
import { withConnection } from "./index";
import type { SectionMember } from "../types";

export async function getUsersSectionMembers(userId: string): Promise<SectionMember[]> {
	return withConnection(async (client: PoolClient) => {
		const query: QueryConfig = {
			text: "SELECT * FROM section_members WHERE user_id = $1",
			values: [userId]
		};

		const res: QueryResult<SectionMember> = await client.query(query);
		const sectionMembers = res.rows;
		return sectionMembers;
	});
}
