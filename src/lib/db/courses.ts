import { v4 as uuidv4 } from "uuid";
import type { QueryConfig, QueryResult } from "pg";
import type { Course, PartialCourse } from "$lib/types";
import { withConnection } from ".";

export async function getCourse(courseID: string): Promise<Course | undefined> {
	return withConnection(async client => {
		const query: QueryConfig = {
			text: `
      SELECT
        c.id,
        c.department_code,
        c.course_code,
        c.course_name
      FROM courses c
      WHERE c.id = $1
      `,
			values: [courseID]
		};

		const res: QueryResult<Course> = await client.query(query);
		if (res.rows.length === 0) {
			return undefined;
		}
		return res.rows[0];
	});
}

export async function createCourse(partialCourse: PartialCourse): Promise<Course> {
	return await withConnection(async client => {
		const newCourse = {
			...partialCourse,

			id: uuidv4()
		};

		await client.query({
			text: `\
INSERT INTO courses (id, department_code, course_code, course_name) VALUES ($1, $2, $3, $4)`,

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
