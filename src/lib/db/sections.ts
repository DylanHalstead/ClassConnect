import type { QueryConfig } from "pg";
import { randomUUID } from "crypto";
import type { PartialSection, Section } from "$lib/types";
import { withConnection } from ".";

export async function createSection(partialSection: PartialSection): Promise<Section> {
	return withConnection(async client => {
		const newSection: Section = {
			...partialSection,

			id: randomUUID()
		};

		const query: QueryConfig = {
			text: `
INSERT INTO sections (id, course_id, section_number, max_daily_bookable_hours)
VALUES ($1, $2, $3, $4)`,
			values: [
				newSection.id,
				newSection.course_id,
				newSection.section_number,
				newSection.max_daily_bookable_hours
			]
		};

		await client.query(query);

		return newSection;
	});
}
