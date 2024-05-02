<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import {
		type CalendarConfiguration,
		type CalendarEvent,
		calendarRowCount,
		calendarStartAndEndTimes,
		dailyCalendarEvents
	} from "$lib/components/calendar";

	import CalendarCardCarousel from "$lib/components/calendar/CalendarCardCarousel.svelte";
	import CalendarDailyCursor from "$lib/components/calendar/CalendarDailyCursor.svelte";
	import CalendarGutter from "$lib/components/calendar/CalendarGutter.svelte";
	import { normalizeDateByDay, normalizeDateByTimeWithinDay } from "$lib/dateManipulation";
	import { currentTime } from "$lib/stores";
	import type { ExtendedAppointmentBlock } from "$lib/types";

	export let configuration: CalendarConfiguration;

	$: dateNormalized = normalizeDateByDay(configuration.currentDate);
	$: events = dailyCalendarEvents(
		configuration.appointments,
		configuration.appointmentBlocks,
		dateNormalized
	);

	$: [startTime, endTime] = calendarStartAndEndTimes(
		events,
		configuration.maximumStartTime,
		configuration.minimumEndTime
	);

	$: rowCount = calendarRowCount(startTime, endTime, configuration.timeIncrement);

	let cellEvents: CalendarEvent[][];

	$: {
		cellEvents = [];

		for (let i = 0; i < rowCount; i++) {
			cellEvents.push([]);
		}

		events.forEach(event => {
			const i =
				Math.floor(normalizeDateByTimeWithinDay(event.startTime).getTime() - startTime.getTime()) /
				configuration.timeIncrement;

			if (
				i >= 0 &&
				i < rowCount &&
				normalizeDateByDay(event.date).getTime() == dateNormalized.getTime()
			) {
				cellEvents[i]?.push(event);
			}
		});
	}

	$: currentTimeNormalized = normalizeDateByTimeWithinDay($currentTime);

	const dispatch = createEventDispatcher<{
		click: {
			appointmentBlock: ExtendedAppointmentBlock;
			appointmentDate: Date;
		};
	}>();

	const gutterTopMargin = "1rem";
</script>

<CalendarGutter
	{startTime}
	{endTime}
	timeIncrement={configuration.timeIncrement}
	gutterCellHeight={configuration.gutterCellHeight}
	{gutterTopMargin}>
	<table class="border-separate border-spacing-0 table-fixed w-full">
		<thead>
			<tr>
				<th class="border-neutral border-b" style:height={gutterTopMargin}></th>
			</tr>
		</thead>

		<tbody class="relative">
			{#each cellEvents as events, i}
				<tr>
					<td class="border-neutral border-e border-s p-0" class:border-b={i < rowCount - 1}>
						<div
							class="overflow-y-scroll p-2 relative z-10"
							style:height={configuration.gutterCellHeight}>
							<CalendarCardCarousel
								{events}
								userID={configuration.userID}
								on:click={event => {
									dispatch("click", event.detail);
								}} />
						</div>
					</td>
				</tr>
			{/each}

			{#if currentTimeNormalized.getTime() >= startTime.getTime() && currentTimeNormalized.getTime() < endTime.getTime()}
				<div
					class="absolute left-0 top-0 w-full"
					style:top={`calc(${currentTimeNormalized.getTime() - startTime.getTime()} / ${configuration.timeIncrement} * (${configuration.gutterCellHeight}))`}>
					<CalendarDailyCursor />
				</div>
			{/if}
		</tbody>
	</table>
</CalendarGutter>
