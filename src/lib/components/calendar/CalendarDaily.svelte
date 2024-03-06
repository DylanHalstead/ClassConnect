<script lang="ts">
	import {
		calendarRowCount,
		calendarStartAndEndTimes,
		type CalendarConfiguration,
		type ExtendedAppointment
	} from "$lib/components/calendar";

	import CalendarCardCarousel from "$lib/components/calendar/CalendarCardCarousel.svelte";
	import CalendarDailyCursor from "$lib/components/calendar/CalendarDailyCursor.svelte";
	import CalendarGutter from "$lib/components/calendar/CalendarGutter.svelte";
	import { normalizeDateByDay, normalizeDateByTimeWithinDay } from "$lib/datemanipulation";
	import { currentTime } from "$lib/stores";

	export let configuration: CalendarConfiguration;

	$: dateNormalized = normalizeDateByDay(configuration.currentDate);

	const [startTime, endTime] = calendarStartAndEndTimes(
		configuration.appointments,
		configuration.maximumStartTime,
		configuration.minimumEndTime
	);

	const rowCount = calendarRowCount(startTime, endTime, configuration.timeIncrement);

	let cellAppointments: ExtendedAppointment[][];

	$: {
		cellAppointments = [];

		for (let i = 0; i < rowCount; i++) {
			cellAppointments.push([]);
		}

		configuration.appointments.forEach(appointment => {
			const i =
				Math.floor(
					normalizeDateByTimeWithinDay(appointment.appointment_block.start_time).getTime() -
						startTime.getTime()
				) / configuration.timeIncrement;

			if (
				i >= 0 &&
				i < rowCount &&
				normalizeDateByDay(appointment.appointment_day).getTime() == dateNormalized.getTime()
			) {
				cellAppointments[i].push(appointment);
			}
		});
	}

	$: currentTimeNormalized = normalizeDateByTimeWithinDay($currentTime);

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
			{#each { length: rowCount } as _, i}
				<tr>
					<td class="border-neutral border-e border-s p-0" class:border-b={i < rowCount - 1}>
						<div
							class="overflow-y-scroll p-2 relative z-10"
							style:height={configuration.gutterCellHeight}>
							<CalendarCardCarousel appointments={cellAppointments[i]} />
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
