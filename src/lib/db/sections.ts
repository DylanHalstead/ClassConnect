import { withConnection } from "$lib/db";
import { getCourses } from "$lib/db/courses";
import type { ExtendedSection, PartialSection, Section } from "$lib/types";
import { randomUUID } from "crypto";
import type { QueryConfig, QueryResult } from "pg";

export async function createSection(partialSection: PartialSection): Promise<Section> {
	return withConnection(async client => {
		const newSection: Section = {
			...partialSection,

			id: randomUUID()
		};

		const query: QueryConfig = {
			text: `
				INSERT INTO sections (id, course_id, section_number, max_daily_bookable_hours)
				VALUES ($1, $2, $3, $4)
			`,
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

export async function extendSections(sections: Section[]): Promise<ExtendedSection[] | Error> {
	const courses = await getCourses(sections.map(section => section.course_id));
	const result: ExtendedSection[] = [];

	for (const [i, section] of sections.entries()) {
		const course = courses[i];

		if (course == undefined) {
			return new Error(`I didn't get back a course with the ID ${section.course_id}`);
		}

		result.push({
			...section,

			course
		});
	}

	return result;
}

export async function getSections(ids: string[]): Promise<Section[]> {
	if (ids.length == 0) {
		return [];
	}

	return withConnection(async client => {
		const query: QueryConfig = {
			text: `
SELECT id, course_id, section_number, max_daily_bookable_hours
FROM sections
WHERE id = ANY($1)`,

			values: [ids]
		};

		const result: QueryResult<Section> = await client.query(query);

		return result.rows;
	});
}
