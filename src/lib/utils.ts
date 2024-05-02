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

	const date = new Date(0);

	date.setHours(hours);
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

/**
 * Postgres makes performing bulk queries (i.e. `WHERE ... = ANY($1)`) difficult for three reasons:
 * 1. If `$1` is empty, the query will fail.
 * 2. The order of the values returned isn't guaranteed to match the order of `$1`.
 * 2. If `$1` contains duplicates, less values will be returned than `$1`'s length.
 *
 * This helper function addresses those problems in a streamlined way, specifically in the context
 * of fetching resources according to their IDs. This function guarantees that if we're issuing a
 * query with n IDs, n rows will be returned (otherwise, we'll return `undefined`).
 *
 * Search the codebase for examples of how this function is used.
 *
 * @typeParam Resource The resource being fetched.
 * @typeParam ErrorLike An error that may be returned while those resources are being fetched.
 * @param queryIds The IDs of the resources being fetched.
 * @param getResources A function to fetch the resources in bulk.
 * @returns The fetched resources, sorted to match the order of the IDs going in, with two caveats:
 *   - If we didn't get a resource for a particular ID, we return `undefined`.
 *   - If `getResources` returned an error, we return that error.
 */
export async function bulkQuery<Resource extends { id: string }, ErrorLike = never>(
	queryIds: string[],
	getResources: () => Promise<Resource[] | ErrorLike>
): Promise<Resource[] | ErrorLike | undefined> {
	if (queryIds.length == 0) {
		return [];
	}

	const resources = await getResources();

	if (!(resources instanceof Array)) {
		return resources;
	}

	const resourcesById = new Map(resources.map(resource => [resource.id, resource]));
	const result: Resource[] = [];

	for (const id of queryIds) {
		const resource = resourcesById.get(id);

		if (resource == undefined) {
			return;
		}

		result.push(resource);
	}

	return result;
}

export function getNumSuffix(i: number): string {
	let selected;

	if ((i > 3 && i < 21) || i % 10 > 3) {
		selected = 0;
	} else {
		selected = i % 10;
	}

	switch (selected) {
		case 0:
			return "th";
		case 1:
			return "st";
		case 2:
			return "nd";
		default:
			return "rd";
	}
}
