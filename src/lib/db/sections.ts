import { getCourses } from "$lib/db/courses";
import type { ExtendedSection, PartialSection, Section } from "$lib/types";
import { bulkQuery } from "$lib/utils";
import { withConnection } from "./index";
import { randomUUID } from "crypto";
import type { QueryConfig, QueryResult } from "pg";

export async function getExtendedSection(sectionID: string): Promise<ExtendedSection | undefined> {
	const section = await getSection(sectionID);
	if (!section) {
		return undefined;
	}

	const course = await getCourses([section.course_id]);
	if (!course || !course[0]) {
		return undefined;
	}

	return {
		...section,
		course: course[0]
	};
}

export async function updateSection(
	sectionID: string,
	partialSection: PartialSection
): Promise<Section | undefined> {
	return withConnection(async client => {
		const query: QueryConfig = {
			text: `
				UPDATE sections s
				SET section_number = $2, max_daily_bookable_hours = $3
				WHERE id = $1
				RETURNING s.id, s.course_id, s.section_number, s.max_daily_bookable_hours
			`,
			values: [sectionID, partialSection.section_number, partialSection.max_daily_bookable_hours]
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

export async function extendSection(section: Section): Promise<ExtendedSection | Error> {
	const extended = await extendSections([section]);

	if (extended instanceof Error) {
		return extended;
	}

	if (extended[0] == undefined) {
		return new Error(`I didn't get back a section with the ID ${section.id}`);
	}

	return extended[0];
}

export async function extendSections(sections: Section[]): Promise<ExtendedSection[] | Error> {
	const courseIds = sections.map(section => section.course_id);
	const courses = await getCourses(courseIds);

	if (courses == undefined) {
		return new Error(`Couldn't find courses with the IDs ${courseIds}`);
	}

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

export async function getSection(id: string): Promise<Section | undefined> {
	const sections = await getSections([id]);

	if (sections == undefined) {
		return;
	}

	return sections[0];
}

export async function getSections(ids: string[]): Promise<Section[] | undefined> {
	return bulkQuery(ids, () =>
		withConnection(async client => {
			const query: QueryConfig = {
				text: `
SELECT id, course_id, section_number, max_daily_bookable_hours
FROM sections
WHERE id = ANY($1)`,

				values: [ids]
			};

			const result: QueryResult<Section> = await client.query(query);

			return result.rows;
		})
	);
}
