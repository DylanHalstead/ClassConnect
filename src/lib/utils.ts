import type { Interval } from "./types";
import { WeekDay } from "./types";

export function postgresTimeWithTimeZoneToDate(timeWithZone: string): Date {
  const [time, timeZoneOffset] = timeWithZone.split('-');
  if (!time || !timeZoneOffset) {
    console.error('Invalid input format. Expected "HH:MM-TZ".');
  }

  const [hours, minutes] = time.split(':').map(num => parseInt(num));

  const date = new Date(0);
  date.setHours(hours-parseInt(timeZoneOffset));
  date.setMinutes(minutes);

  return date;
}

export function stringToWeekDay(dayString: string): WeekDay | undefined {
  switch (dayString.toLowerCase()) {
    case 'monday':
      return WeekDay.Monday;
    case 'tuesday':
      return WeekDay.Tuesday;
    case 'wednesday':
      return WeekDay.Wednesday;
    case 'thursday':
      return WeekDay.Thursday;
    case 'friday':
      return WeekDay.Friday;
    case 'saturday':
      return WeekDay.Saturday;
    case 'sunday':
      return WeekDay.Sunday;
    default:
      return undefined; 
  }
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
