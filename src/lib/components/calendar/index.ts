import { normalizeDateByTimeWithinDay } from "$lib/dateManipulation";
import type { ExtendedAppointment } from "$lib/types";

export interface CalendarConfiguration {
	/**
	 * If the calendar is daily, the date the calendar will be focused on. Otherwise,
	 * the date whose week the calendar will be focused on. Note that in the former case,
	 * if the date's day is one other than the start of the week, its day will be set to the
	 * start of the week so the calendar doesn't display two weeks at once.
	 */
	currentDate: Date;

	/**
	 * The minimum time to display on a given day. Note that this time will be decreased to
	 * accomodate any appointments that fall before it.
	 */
	maximumStartTime: Date;

	/**
	 * The maximum time to display on a given day. Note that this time will be increased to
	 * accomodate any appointments that fall after it.
	 */
	minimumEndTime: Date;

	/**
	 * The length of time, in milliseconds, that a cell on the calendar measures.
	 */
	timeIncrement: number;
	appointments: ExtendedAppointment[];

	/**
	 * The height of each calendar gutter cell as a CSS expression.
	 *
	 * Note: Don't provide any user-supplied values here, since this is vulnerable to injection.
	 */
	gutterCellHeight: string;
}

export enum CalendarMode {
	Daily = "daily",
	Weekly = "weekly"
}

export function calendarRowCount(startTime: Date, endTime: Date, timeIncrement: number): number {
	return (endTime.getTime() - startTime.getTime()) / timeIncrement;
}

export function calendarStartAndEndTimes(
	appointments: ExtendedAppointment[],
	maximumStartTime: Date,
	minimumEndTime: Date
): [Date, Date] {
	const startTime = new Date(
		Math.min(
			...[
				...appointments.map(appointment => appointment.appointment_block.start_time),
				maximumStartTime
			].map(time => normalizeDateByTimeWithinDay(time).getTime())
		)
	);

	const endTime = new Date(
		Math.max(
			...[
				...appointments.map(appointment => appointment.appointment_block.start_time),
				minimumEndTime
			].map(time => normalizeDateByTimeWithinDay(time).getTime())
		)
	);

	return [startTime, endTime];
}
