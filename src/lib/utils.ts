import type {
	PostgresAppointmentBlock,
	AppointmentBlock,
	Interval,
	User,
	ExtendedSection
} from "./types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function postgresTimeWithTimeZoneToDate(timeWithZone: string): Date | Error {
	const [time, timeZoneOffset] = timeWithZone.split("-");

	if (time == undefined || timeZoneOffset == undefined) {
		return new Error(`This PostgreSQL timestamp doesn't contain a \"-\": ${timeWithZone}`);
	}

	const [hours, minutes] = time.split(":").map(num => parseInt(num));

	if (hours == undefined || minutes == undefined) {
		return new Error(`This PostgreSQL timestamp doesn't contain a \":\": ${timeWithZone}`);
	}

	if (isNaN(hours) || isNaN(minutes)) {
		return new Error(
			`This PostgreSQL timestamp's hours and minutes aren't numeric: ${timeWithZone}`
		);
	}

	const parsedTimeZoneOffset = parseInt(timeZoneOffset);

	if (isNaN(parsedTimeZoneOffset)) {
		return new Error(`This PostgreSQL timestamp's timezone offset isn't numeric: ${timeWithZone}`);
	}

	const date = new Date(0);

	date.setHours(hours - parsedTimeZoneOffset);
	date.setMinutes(minutes);

	return date;
}

export function formTimeToDate(time: string): Date | undefined {
	const date = new Date(0);
	const [hours, minutes] = time.split(":").map(num => parseInt(num));
	if (hours == undefined || minutes == undefined || isNaN(hours) || isNaN(minutes)) {
		return undefined;
	}
	date.setHours(hours);
	date.setMinutes(minutes);
	return date;
}

export function getEnumValue<A extends Record<string, string>>(
	value: string,
	enum_: A
): A[keyof A] | undefined {
	for (const key in enum_) {
		if (enum_[key] == value) {
			return enum_[key];
		}
	}

	return undefined;
}

export function intervalToMilliseconds(interval: Interval): number {
	const { hours = 0, minutes = 0 } = interval;
	const millisecondsPerHour = 60 * 60 * 1000; // 1 hour = 60 minutes * 60 seconds * 1000 milliseconds
	const millisecondsPerMinute = 60 * 1000; // 1 minute = 60 seconds * 1000 milliseconds

	const totalMilliseconds = hours * millisecondsPerHour + minutes * millisecondsPerMinute;
	return totalMilliseconds;
}

export function postgresAppointmentBlockToAppointmentBlock(
	postgresAppointmentBlock: PostgresAppointmentBlock
): AppointmentBlock | Error {
	const startTime = postgresTimeWithTimeZoneToDate(postgresAppointmentBlock.start_time);

	if (startTime instanceof Error) {
		return startTime;
	}

	const appointmentBlock: AppointmentBlock = {
		id: postgresAppointmentBlock.id,
		instructional_member_id: postgresAppointmentBlock.instructional_member_id,
		week_day: postgresAppointmentBlock.week_day,
		start_time: startTime,
		duration: intervalToMilliseconds(postgresAppointmentBlock.duration)
	};

	return appointmentBlock;
}

export function sectionName(section: ExtendedSection): string {
	return `${section.course.department_code} ${section.course.course_code}-${section.section_number}`;
}

export function userName(user: User): string {
	return `${user.first_name} ${user.last_name}`;
}
