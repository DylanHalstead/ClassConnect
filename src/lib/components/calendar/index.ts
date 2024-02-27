export function normalizeDateByDay(date: Date): Date {
	const result = new Date(date);

	result.setHours(0, 0, 0, 0);

	return result;
}

export function normalizeDateByWeek(date: Date): Date {
	const result = normalizeDateByDay(date);

	result.setTime(result.getTime() - result.getDay() * 24 * 60 * 60 * 1000);

	return result;
}
