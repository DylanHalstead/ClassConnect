import { withConnection } from "$lib/db";
import type { Course, PartialCourse } from "$lib/types";
import { randomUUID } from "crypto";
import type { QueryConfig, QueryResult } from "pg";

export async function createCourse(partialCourse: PartialCourse): Promise<Course> {
	return await withConnection(async client => {
		const newCourse = {
			...partialCourse,

			id: randomUUID()
		};

		await client.query({
			text: `
				INSERT INTO courses (id, department_code, course_code, course_name)
				VALUES ($1, $2, $3, $4)
			`,
			values: [
				newCourse.id,
				newCourse.department_code,
				newCourse.course_code,
				newCourse.course_name
			]
		});

		return newCourse;
	});
}

export async function getCourses(ids: string[]): Promise<Course[]> {
	return withConnection(async client => {
		const query: QueryConfig = {
			text: `
SELECT id, department_code, course_code, course_name
FROM courses
WHERE id = ANY($1)`,

			values: [ids]
		};

		const result: QueryResult<Course> = await client.query(query);

		return result.rows;
	});
}
