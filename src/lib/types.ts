export interface Course {
	id: string;
	department_code: string;
	course_code: string;
	course_name: string;
}

export interface User {
	id: string;
	email: string;
	first_name: string;
	last_name: string;
}

export interface Section {
	id: string;
	course_id: string;
	section_number: number;
	max_daily_bookable_hours: number;
}

export enum SectionMemberType {
	Instructor = "instructor",
	TA = "ta",
	Student = "student"
}

export interface SectionMember {
	id: string;
	section_id: string;
	user_id: string;
	member_type: SectionMemberType;
	is_restricted: boolean;
}

export enum WeekDay {
	Sunday = "sunday",
	Monday = "monday",
	Tuesday = "tuesday",
	Wednesday = "wednesday",
	Thursday = "thursday",
	Friday = "friday",
	Saturday = "saturday"
}

export interface AppointmentBlock {
	id: string;
	instructional_member_id: string;
	week_day: WeekDay;
	start_time: Date;

	/**
	 * Represented in milliseconds.
	 */
	duration: number;
}

export interface Appointment {
	id: string;
	appointment_day: Date;
	appointment_block: string;
	student_id: string;
	cancelled: boolean;
	link: string;
}
