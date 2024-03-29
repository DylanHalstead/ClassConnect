export type Course = {
	id: string;
	department_code: string;
	course_code: string;
	course_name: string;
};

export type User = {
	id: string;
	email: string;
	first_name: string;
	last_name: string;
};

export type Section = {
	id: string;
	course_id: string;
	section_number: number;
	max_daily_bookable_hours: number;
};

/**
 * @description Note that the order of these enums is used their level of authority (student at top index0).
 */
export enum SectionMemberType {
	Student = "student",
	TA = "ta",
	Instructor = "instructor",
}

export type SectionMember = {
	id: string;
	section_id: string;
	user_id: string;
	member_type: SectionMemberType;
	is_restricted: boolean;
};

export enum WeekDay {
	Sunday = "sunday",
	Monday = "monday",
	Tuesday = "tuesday",
	Wednesday = "wednesday",
	Thursday = "thursday",
	Friday = "friday",
	Saturday = "saturday"
}

export type Interval = {
	hours?: number;
	minutes?: number;
};

export interface PostgresAppointmentBlock {
	id: string;
	instructional_member_id: string;
	week_day: WeekDay;
	start_time: string;
	duration: Interval;
}

export type AppointmentBlock = Omit<PostgresAppointmentBlock, "start_time" | "duration"> & {
	start_time: Date;
	// millisecond difference from start_time to "end_time"
	duration: number;
};

export type Appointment = {
	id: string;
	appointment_day: Date;
	appointment_block: string;
	student_id: string;
	cancelled: boolean;
	link: string;
};

export type ExtendedAppointmentBlock = Omit<AppointmentBlock, "instructional_member_id"> & {
	instructional_member: InstructionalMember;
};

export type ExtendedAppointment = Omit<Appointment, "appointment_block" | "student_id"> & {
	appointment_block: ExtendedAppointmentBlock;
	student: Student;
};

export type ExtendedSection = Omit<Section, "course_id"> & { course: Course };

export type FlatExtendedSection = Section & Omit<Course, "id">;

export type ExtendedSectionMember = Omit<SectionMember, "section_id" | "user_id"> & {
	section: ExtendedSection;
	user: User;
};

export type FlatExtendedSectionMember = SectionMember & Omit<User, "id"> & Omit<Course, "id"> & Omit<Section, "id">;

export type InstructionalMember = Omit<ExtendedSectionMember, "member_type"> & {
	member_type: SectionMemberType.Instructor | SectionMemberType.TA;
};

export type Student = Omit<ExtendedSectionMember, "member_type"> & {
	member_type: SectionMemberType.Student;
};
