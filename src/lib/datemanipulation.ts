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
