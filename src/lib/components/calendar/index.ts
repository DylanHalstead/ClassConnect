import type {
	Appointment,
	AppointmentBlock,
	Course,
	Section,
	SectionMember,
	SectionMemberType,
	User
} from "../../types";

export enum CalendarMode {
	Daily = "daily",
	Weekly = "weekly"
}

export type ExtendedAppointmentBlock = Omit<AppointmentBlock, "instructional_member_id"> & {
	instructional_member: InstructionalMember;
};

export type ExtendedAppointment = Omit<Appointment, "appointment_block" | "student_id"> & {
	appointment_block: ExtendedAppointmentBlock;
	student: Student;
};

export type ExtendedSection = Omit<Section, "course_id"> & { course: Course };

export type ExtendedSectionMember = Omit<SectionMember, "section_id" | "user_id"> & {
	section: ExtendedSection;
	user: User;
};

export type InstructionalMember = Omit<ExtendedSectionMember, "member_type"> & {
	member_type: SectionMemberType.Instructor | SectionMemberType.TA;
};

export type Student = Omit<ExtendedSectionMember, "member_type"> & {
	member_type: SectionMemberType.Student;
};

/**
 * Returns a copy of the provided {@link Date} with its time within the day set to midnight.
 */
export function normalizeDateByDay(date: Date): Date {
	const result = new Date(date);

	result.setHours(0, 0, 0, 0);

	return result;
}

/**
 * Returns a copy of the provided {@link Date} with only its time information preserved.
 *
 * That is, the copy's day is set to the Unix epoch.
 */
export function normalizeDateByTimeWithinDay(date: Date): Date {
	const result = new Date(date);

	result.setFullYear(1970, 0, 1);

	return result;
}

/**
 * Returns a copy of the provided {@link Date} with:
 * - Its day within the week set to the first day of the week
 * - Its time within the day set to midnight.
 */
export function normalizeDateByWeek(date: Date): Date {
	const result = normalizeDateByDay(date);

	result.setTime(result.getTime() - result.getDay() * 24 * 60 * 60 * 1000);

	return result;
}

export function sectionName(section: ExtendedSection): string {
	return `${section.course.department_code} ${section.course.course_code}-${section.section_number}`;
}

export function userName(user: User): string {
	return `${user.first_name} ${user.last_name}`;
}
