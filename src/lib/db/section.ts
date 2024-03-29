import { withConnection } from "./index";
import type { QueryConfig, QueryResult } from "pg";
import { ExtendedSection, FlatExtendedSection } from "$lib/types";
import { flatExtendedSectionToExtendedSection } from "../utils";

export async function getExtendedSection(sectionID: string): Promise<ExtendedSection | null> {
  return withConnection(async (connection) => {
    const query: QueryConfig = {
			text: `
        SELECT
          s.id,
          s.course_id,
          s.section_number,
          s.max_daily_bookable_hours,
          c.course_name,
          c.department_code,
          c.course_code
        FROM sections s
        JOIN courses c ON s.course_id = c.id
        WHERE s.id = $1
        `,
			values: [sectionID]
		};

    const res: QueryResult<FlatExtendedSection> = await connection.query(query);
    if (res.rows.length === 0) {
			return undefined;
		}
    const row = res.rows[0];
		return flatExtendedSectionToExtendedSection(row);
  });
}