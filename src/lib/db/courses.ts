import { v4 as uuidv4 } from "uuid";
import type { Course, PartialCourse } from "$lib/types";
import { withConnection } from ".";

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
