export interface PartialCourse {
	department_code: string;
	course_code: string;
	course_name: string;
}

export type Course = PartialCourse & {
	id: string;
};

export interface PartialUser {
	email: string;
	first_name: string;
	last_name: string;
}

export type User = PartialUser & {
	id: string;
};

export interface PartialSection {
	course_id: string;
	section_number: number;
	max_daily_bookable_hours: number;
}

export type Section = PartialSection & {
	id: string;
};

export type ExtendedSection = Omit<Section, "course_id"> & { course: Course };

export enum SectionMemberType {
	Instructor = "instructor",
	TA = "ta",
	Student = "student"
}

export interface PartialSectionMember {
	section_id: string;
	user_id: string;
	member_type: SectionMemberType;
	is_restricted: boolean;
}

export type SectionMember = PartialSectionMember & {
	id: string;
};

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
	duration: number;
};

export type PartialAppointmentBlock = Omit<AppointmentBlock, "id">;
export type ExtendedAppointmentBlock = Omit<AppointmentBlock, "instructional_member_id"> & {
	instructional_member: InstructionalMember;
};

export interface PartialAppointment {
	appointment_day: Date;
	appointment_block: string;
	student_id: string;
	cancelled: boolean;
	link: string;
}

export type Appointment = PartialAppointment & {
	id: string;
};

export type ExtendedAppointment = Omit<Appointment, "appointment_block" | "student_id"> & {
	appointment_block: ExtendedAppointmentBlock;
	student: Student;
};
