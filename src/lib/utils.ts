import type { PostgresAppointmentBlock, AppointmentBlock, Interval, User, ExtendedSection } from "./types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function postgresTimeWithTimeZoneToDate(timeWithZone: string): Date | undefined {
	const [time, timeZoneOffset] = timeWithZone.split("-");
	if (!time || !timeZoneOffset) {
		return undefined;
	}

	const [hours, minutes] = time.split(":").map(num => parseInt(num));
	if (isNaN(hours) || isNaN(minutes)) {
		return undefined;
	}

	const parsedTimeZoneOffset = parseInt(timeZoneOffset);
	if (isNaN(parsedTimeZoneOffset)) {
		return undefined;
	}

	const date = new Date(0);
	date.setHours(hours - parsedTimeZoneOffset);
	date.setMinutes(minutes);

	return date;
}

export function formTimeToDate(time: string): Date | undefined {
	const date = new Date(0);
	const [hours, minutes] = time.split(":").map(num => parseInt(num));
	if (isNaN(hours) || isNaN(minutes)) {
		return undefined;
	}
	date.setHours(hours);
	date.setMinutes(minutes);
	return date;
}

export function getEnumValue<A extends Record<string, string>>(value: string, enum_: A): A[keyof A] | undefined {
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

export function dateToPostgresTimeWithTimeZone(date: Date): string {
	const hours = date.getUTCHours();
	const minutes = date.getUTCMinutes();
	const getTimezoneOffset = date.getTimezoneOffset() / 60;

	return `${hours}:${minutes}-0${getTimezoneOffset}`;
}

export function millisecondsToIntervalString(milliseconds: number): string {
	const seconds = Math.floor(milliseconds / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);

	const intervalString = `${days} days ${hours % 24} hours ${minutes % 60} minutes ${seconds % 60} seconds`;
	return intervalString;
}

export function postgresAppointmentBlockToAppointmentBlock(postgresAppointmentBlock: PostgresAppointmentBlock): AppointmentBlock | undefined {
	const start_time = postgresTimeWithTimeZoneToDate(postgresAppointmentBlock.start_time);
	if (!start_time) {
		return undefined;
	}
	const appointmentBlock: AppointmentBlock = {
		id: postgresAppointmentBlock.id,
		instructional_member_id: postgresAppointmentBlock.instructional_member_id,
		week_day: postgresAppointmentBlock.week_day,
		start_time: start_time,
		duration: intervalToMilliseconds(postgresAppointmentBlock.duration)
	};
	return appointmentBlock;
}

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
