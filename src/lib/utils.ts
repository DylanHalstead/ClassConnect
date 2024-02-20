import type { Interval } from "./types";

export function intervalToDate(intervalString: Interval): Date {
  const hours = intervalString.hours || 0;
  const minutes = intervalString.minutes || 0;

  const date = new Date(0);
  date.setUTCHours(hours);
  date.setUTCMinutes(minutes);

  return date;
}

export function intervalToString(interval: Interval): string {
  const hours = interval.hours || 0;
  const minutes = interval.minutes || 0;

  return `${hours}hours ${minutes} minutes`;
}

export function parseTimeWithTimeZone(timeWithZone: string): Date {
  const timeParts = timeWithZone.split('-');
  if (timeParts.length !== 2) {
    console.error('Invalid input format. Expected "HH:MM-TZ".');
  }

  const timePart = timeParts[0];
  const timeZonePart = parseInt(timeParts[1]);

  const [hoursStr, minutesStr] = timePart.split(':');
  const hours = parseInt(hoursStr);
  const minutes = parseInt(minutesStr);

  const date = new Date(0);
  date.setUTCHours(hours);
  date.setUTCMinutes(minutes - timeZonePart * 60);

  return date;
}