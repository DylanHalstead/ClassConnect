export type Course = {
	id: string;
	department_code: string;
	course_code: string;
	course_name: string;
}

export type User = {
	id: string;
	email: string;
	first_name: string;
	last_name: string;
}

export type Section = {
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

export type SectionMember = {
	id: string;
	section_id: string;
	user_id: string;
	member_type: SectionMemberType;
	is_restricted: boolean;
}

export enum WeekDay {
	Monday = "monday",
	Tuesday = "tuesday",
	Wednesday = "wednesday",
	Thursday = "thursday",
	Friday = "friday",
	Saturday = "saturday",
	Sunday = "sunday"
}

export type Interval = {
	hours?: number;
	minutes?: number;
}

export interface PostgresAppointmentBlock {
	id: string;
	instructional_member_id: string;
	week_day: WeekDay;
	start_time: string;
	duration: Interval;
}

export type AppointmentBlock = Omit<PostgresAppointmentBlock, "start_time"|"duration"> & {
  start_time: Date,
	// millisecond difference from start_time to "end_time"
	duration: number
};

export type Appointment = {
	id: string;
	appointment_day: Date;
	appointment_block: string;
	student_id: string;
	cancelled: boolean;
	link: string;
}
