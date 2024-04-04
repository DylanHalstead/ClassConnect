import { randomUUID } from "crypto";
import type { Course, PartialCourse } from "$lib/types";
import { withConnection } from ".";

export async function createCourse(partialCourse: PartialCourse): Promise<Course> {
	return await withConnection(async client => {
		const newCourse = {
			...partialCourse,

			id: randomUUID()
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
