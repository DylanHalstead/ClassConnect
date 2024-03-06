<script lang="ts">
	import { type ExtendedAppointment } from "$lib/components/calendar";
	import CalendarCardCarousel from "$lib/components/calendar/CalendarCardCarousel.svelte";
	import CalendarGutter from "$lib/components/calendar/CalendarGutter.svelte";
	import {
		normalizeDateByDay,
		normalizeDateByTimeWithinDay,
		normalizeDateByWeek
	} from "$lib/datemanipulation";

	/**
	 * The date whose week the calendar will be focused on. Note that if the date's day is one other
	 * than the start of the week, its day will be set to the start of the week so the calendar
	 * doesn't display two weeks at once.
	 */
	export let week: Date;

	$: weekNormalized = normalizeDateByWeek(week);

	/**
	 * The minimum time to display on a given day. Note that this time will be decreased to
	 * accomodate any appointments that fall before it.
	 */
	export let maximumStartTime: Date;

	/**
	 * The maximum time to display on a given day. Note that this time will be increased to
	 * accomodate any appointments that fall after it.
	 */
	export let minimumEndTime: Date;

	/**
	 * The length of time, in milliseconds, that a cell on the calendar measures.
	 */
	export let timeIncrement: number;
	export let appointments: ExtendedAppointment[];

	const gutterCellHeight = "8rem";
	const gutterTopMargin = "6rem";
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

	const rowCount = (endTime.getTime() - startTime.getTime()) / timeIncrement;
	const today = normalizeDateByDay(new Date());
	const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

	let columnDates: Date[];

	$: {
		columnDates = [];

		const current = new Date(weekNormalized);

		for (let i = 0; i < 7; i++) {
			columnDates.push(new Date(current));
			current.setTime(current.getTime() + 24 * 60 * 60 * 1000);
		}
	}

	let cellAppointments: ExtendedAppointment[][][];

	$: {
		cellAppointments = [];

		for (let i = 0; i < rowCount; i++) {
			cellAppointments.push([]);

			for (let j = 0; j < 7; j++) {
				cellAppointments[i].push([]);
			}
		}

		appointments.forEach(appointment => {
			const i =
				Math.floor(
					normalizeDateByTimeWithinDay(appointment.appointment_block.start_time).getTime() -
						startTime.getTime()
				) / timeIncrement;

			if (i < 0 || i >= rowCount) {
				return;
			}

			const j = Math.floor(
				(normalizeDateByDay(appointment.appointment_day).getTime() - weekNormalized.getTime()) /
					(24 * 60 * 60 * 1000)
			);

			if (j < 0 || j >= 7) {
				return;
			}

			cellAppointments[i][j].push(appointment);
		});
	}

	function formatColumnDate(date: Date): string {
		return date.toLocaleString("en-US", {
			day: "2-digit",
			month: "2-digit"
		});
	}
</script>

<CalendarGutter {startTime} {endTime} {timeIncrement} {gutterCellHeight} {gutterTopMargin}>
	<table class="border-separate border-spacing-0 table-fixed w-full">
		<thead>
			<tr>
				{#each columnDates as date, i}
					{@const isToday = date.getTime() == today.getTime()}

					<th
						class="bg-base-100 border-neutral border-b border-s sticky top-0 z-10"
						class:border-e={i == 6}
						style:height={gutterTopMargin}>
						<h2
							class="cell-header-weekday text-2xl"
							class:text-primary={isToday}
							class:underline={isToday}>
							{weekdays[i]}
						</h2>

						<span class="text-base-content/50 text-sm">
							{formatColumnDate(date)}
						</span>
					</th>
				{/each}
			</tr>
		</thead>

		<tbody>
			{#each { length: rowCount } as _, i}
				<tr>
					{#each { length: 7 } as _, j}
						<td
							class="border-neutral border-s p-0"
							class:border-b={i < rowCount - 1}
							class:border-e={j == 6}>
							<div class="overflow-y-scroll p-2" style:height={gutterCellHeight}>
								<CalendarCardCarousel appointments={cellAppointments[i][j]} />
							</div>
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</CalendarGutter>

<style>
	.cell-header-weekday {
		font-family: "Kaisei HarunoUmi", serif;
	}
</style>
