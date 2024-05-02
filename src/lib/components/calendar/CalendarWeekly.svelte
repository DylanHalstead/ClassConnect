<script lang="ts">
	import {
		type CalendarConfiguration,
		type CalendarEvent,
		calendarRowCount,
		calendarStartAndEndTimes,
		weeklyCalendarEvents
	} from "$lib/components/calendar";

	import CalendarCardCarousel from "$lib/components/calendar/CalendarCardCarousel.svelte";
	import CalendarGutter from "$lib/components/calendar/CalendarGutter.svelte";
	import {
		normalizeDateByDay,
		normalizeDateByTimeWithinDay,
		normalizeDateByWeek
	} from "$lib/dateManipulation";

	import type { ExtendedAppointmentBlock } from "$lib/types";
	import { createEventDispatcher } from "svelte";

	export let configuration: CalendarConfiguration;

	$: weekNormalized = normalizeDateByWeek(configuration.currentDate);
	$: events = weeklyCalendarEvents(
		configuration.appointments,
		configuration.appointmentBlocks,
		weekNormalized
	);

	$: [startTime, endTime] = calendarStartAndEndTimes(
		events,
		configuration.maximumStartTime,
		configuration.minimumEndTime
	);

	$: rowCount = calendarRowCount(startTime, endTime, configuration.timeIncrement);
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

	let cellEvents: CalendarEvent[][][];

	$: {
		cellEvents = [];

		for (let i = 0; i < rowCount; i++) {
			const row: CalendarEvent[][] = [];

			cellEvents.push(row);

			for (let j = 0; j < 7; j++) {
				row.push([]);
			}
		}

		events.forEach(event => {
			const i =
				Math.floor(normalizeDateByTimeWithinDay(event.startTime).getTime() - startTime.getTime()) /
				configuration.timeIncrement;

			if (i < 0 || i >= rowCount) {
				return;
			}

			const j = Math.floor(
				(normalizeDateByDay(event.date).getTime() - weekNormalized.getTime()) /
					(24 * 60 * 60 * 1000)
			);

			if (j < 0 || j >= 7) {
				return;
			}

			getEvents(i, j).push(event);
		});
	}

	const dispatch = createEventDispatcher<{
		click: {
			appointmentBlock: ExtendedAppointmentBlock;
			appointmentDate: Date;
		};
	}>();

	const gutterTopMargin = "6rem";

	function formatColumnDate(date: Date): string {
		return date.toLocaleString("en-US", {
			day: "2-digit",
			month: "2-digit"
		});
	}

	function getEvents(row: number, column: number): CalendarEvent[] {
		return (cellEvents[row] ?? [])[column] ?? [];
	}
</script>

<CalendarGutter
	{startTime}
	{endTime}
	timeIncrement={configuration.timeIncrement}
	gutterCellHeight={configuration.gutterCellHeight}
	gutterTopMargin="6rem">
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
							class="cell-header-weekday font-kaisei text-2xl"
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
							<div class="overflow-y-scroll p-2" style:height={configuration.gutterCellHeight}>
								{#key configuration}
									<CalendarCardCarousel
										events={getEvents(i, j)}
										userID={configuration.userID}
										on:click={event => {
											dispatch("click", event.detail);
										}} />
								{/key}
							</div>
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</CalendarGutter>
