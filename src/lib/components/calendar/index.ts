import {
	normalizeDateByDay,
	normalizeDateByTimeWithinDay,
	normalizeDateByWeek
} from "$lib/dateManipulation";
import { weekDayIndex, type ExtendedAppointment, type ExtendedAppointmentBlock } from "$lib/types";

export interface CalendarConfiguration {
	appointments: ExtendedAppointment[];
	appointmentBlocks: ExtendedAppointmentBlock[];

	/**
	 * If the calendar is daily, the date the calendar will be focused on. Otherwise,
	 * the date whose week the calendar will be focused on. Note that in the former case,
	 * if the date's day is one other than the start of the week, its day will be set to the
	 * start of the week so the calendar doesn't display two weeks at once.
	 */
	currentDate: Date;

	/**
	 * The height of each calendar gutter cell as a CSS expression.
	 *
	 * Note: Don't provide any user-supplied values here, since this is vulnerable to injection.
	 */
	gutterCellHeight: string;

	/**
	 * The minimum time to display on a given day. Note that this time will be decreased to
	 * accommodate any appointments that fall before it.
	 */
	maximumStartTime: Date;

	/**
	 * The maximum time to display on a given day. Note that this time will be increased to
	 * accommodate any appointments that fall after it.
	 */
	minimumEndTime: Date;

	/**
	 * The length of time, in milliseconds, that a cell on the calendar measures.
	 */
	timeIncrement: number;
	userID: string;
}

/**
 * Encapsulates both appointment blocks and appointments to simplify displaying both of them on the
 * calendar.
 */
export interface CalendarEvent {
	date: Date;
	duration: number;
	startTime: Date;
	underlying: ExtendedAppointmentBlock | ExtendedAppointment;
}

export enum CalendarMode {
	Daily = "daily",
	Weekly = "weekly"
}

function appointmentBlockToCalendarEvent(
	appointmentBlock: ExtendedAppointmentBlock,
	date: Date
): CalendarEvent {
	return {
		date,
		duration: appointmentBlock.duration,
		startTime: appointmentBlock.start_time,
		underlying: appointmentBlock
	};
}

function appointmentToCalendarEvent(appointment: ExtendedAppointment): CalendarEvent {
	return {
		date: appointment.appointment_day,
		duration: appointment.appointment_block.duration,
		startTime: appointment.appointment_block.start_time,
		underlying: appointment
	};
}

export function calendarRowCount(startTime: Date, endTime: Date, timeIncrement: number): number {
	return (endTime.getTime() - startTime.getTime()) / timeIncrement;
}

export function calendarStartAndEndTimes(
	events: CalendarEvent[],
	maximumStartTime: Date,
	minimumEndTime: Date
): [Date, Date] {
	const startTime = new Date(
		Math.min(
			...[...events.map(event => event.startTime), maximumStartTime].map(time =>
				normalizeDateByTimeWithinDay(time).getTime()
			)
		)
	);

	const endTime = new Date(
		Math.max(
			...[...events.map(event => event.startTime), minimumEndTime].map(time =>
				normalizeDateByTimeWithinDay(time).getTime()
			)
		)
	);

	return [startTime, endTime];
}

export function dailyCalendarEvents(
	appointments: ExtendedAppointment[],
	appointmentBlocks: ExtendedAppointmentBlock[],
	currentDate: Date
): CalendarEvent[] {
	const normalizedCurrentDate = normalizeDateByDay(currentDate);
	const todaysAppointments = appointments.filter(
		appointment =>
			normalizeDateByDay(appointment.appointment_day).getTime() == normalizedCurrentDate.getTime()
	);

	const appointmentEvents = todaysAppointments.map(appointment =>
		appointmentToCalendarEvent(appointment)
	);

	const appointmentBlockEvents = excludeBookedAppointmentBlocks(
		appointmentBlocks,
		todaysAppointments
	)
		.filter(appointmentBlock => weekDayIndex(appointmentBlock.week_day) == currentDate.getDay())
		.map(appointmentBlock => appointmentBlockToCalendarEvent(appointmentBlock, currentDate));

	return [...appointmentEvents, ...appointmentBlockEvents];
}

export function excludeBookedAppointmentBlocks(
	appointmentBlocks: ExtendedAppointmentBlock[],
	appointments: ExtendedAppointment[]
): ExtendedAppointmentBlock[] {
	const appointmentAppointmentBlockIds = new Set(
		appointments.map(appointment => appointment.appointment_block.id)
	);

	return appointmentBlocks.filter(
		appointmentBlock => !appointmentAppointmentBlockIds.has(appointmentBlock.id)
	);
}

export function isCalendarEventAppointmentBlock(
	underlying: ExtendedAppointment | ExtendedAppointmentBlock
): underlying is ExtendedAppointmentBlock {
	return "instructional_member_id" in underlying;
}

export function weeklyCalendarEvents(
	appointments: ExtendedAppointment[],
	appointmentBlocks: ExtendedAppointmentBlock[],
	currentWeek: Date
): CalendarEvent[] {
	const normalizedCurrentWeek = normalizeDateByWeek(currentWeek);
	const thisWeeksAppointments = appointments.filter(
		appointment =>
			normalizeDateByWeek(appointment.appointment_day).getTime() == normalizedCurrentWeek.getTime()
	);

	const appointmentEvents = thisWeeksAppointments.map(appointment =>
		appointmentToCalendarEvent(appointment)
	);

	const appointmentBlockEvents = excludeBookedAppointmentBlocks(
		appointmentBlocks,
		thisWeeksAppointments
	).map(appointmentBlock => {
		const date = new Date(currentWeek);

		date.setDate(date.getDate() + weekDayIndex(appointmentBlock.week_day));

		return appointmentBlockToCalendarEvent(appointmentBlock, date);
	});

	return [...appointmentEvents, ...appointmentBlockEvents];
}
