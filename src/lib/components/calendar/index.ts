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

export function sectionName(section: ExtendedSection): string {
	return `${section.course.department_code} ${section.course.course_code}-${section.section_number}`;
}

export function userName(user: User): string {
	return `${user.first_name} ${user.last_name}`;
}
