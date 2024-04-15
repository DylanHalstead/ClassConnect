import { getCourse } from "$lib/db/courses";
import type { ExtendedSection, Section } from "$lib/types";
import { withConnection } from "./index";
import type { QueryConfig, QueryResult } from "pg";

export async function getSection(sectionID: string): Promise<Section | undefined> {
	return withConnection(async client => {
		const query: QueryConfig = {
			text: `
				SELECT
					s.id,
					s.course_id,
					s.section_number,
					s.max_daily_bookable_hours
				FROM sections s
				WHERE s.id = $1
      `,
			values: [sectionID]
		};

		const res: QueryResult<Section> = await client.query(query);
		if (res.rows.length === 0) {
			return undefined;
		}
		return res.rows[0];
	});
}

export async function getExtendedSection(sectionID: string): Promise<ExtendedSection | undefined> {
	const section = await getSection(sectionID);
	if (!section) {
		return undefined;
	}

	const course = await getCourse(section.course_id);
	if (!course) {
		return undefined;
	}

	return {
		...section,
		course
	};
}

export async function updateSection(sectionID: string, sectionNumber: number, maxDailyBookableHours: number): Promise<Section | undefined> {
	return withConnection(async client => {
		const query: QueryConfig = {
			text: `
				UPDATE sections s
				SET section_number = $2, max_daily_bookable_hours = $3
				WHERE id = $1
				RETURNING s.id, s.course_id, s.section_number, s.max_daily_bookable_hours
			`,
			values: [sectionID, sectionNumber, maxDailyBookableHours]
		};

		const res: QueryResult<Section> = await client.query(query);
		if (res.rows.length === 0) {
			return undefined;
		}
		return res.rows[0];
	});
}

export async function deleteSection(sectionID: string): Promise<boolean> {
	return withConnection(async client => {
		const query: QueryConfig = {
			text: `
				DELETE FROM sections
				WHERE id = $1
			`,
			values: [sectionID]
		};

		try {
			await client.query(query);
			return true;
		} catch (e) {
			return false;
		}
	});
}