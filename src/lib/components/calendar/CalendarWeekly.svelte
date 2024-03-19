<script lang="ts">
	import {
		calendarStartAndEndTimes,
		type CalendarConfiguration,
		type ExtendedAppointment,
		calendarRowCount
	} from "$lib/components/calendar";

	import CalendarCardCarousel from "$lib/components/calendar/CalendarCardCarousel.svelte";
	import CalendarGutter from "$lib/components/calendar/CalendarGutter.svelte";
	import {
		normalizeDateByDay,
		normalizeDateByTimeWithinDay,
		normalizeDateByWeek
	} from "$lib/datemanipulation";

	export let configuration: CalendarConfiguration;

	$: weekNormalized = normalizeDateByWeek(configuration.currentDate);

	const [startTime, endTime] = calendarStartAndEndTimes(
		configuration.appointments,
		configuration.maximumStartTime,
		configuration.minimumEndTime
	);

	const rowCount = calendarRowCount(startTime, endTime, configuration.timeIncrement);
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

		configuration.appointments.forEach(appointment => {
			const i =
				Math.floor(
					normalizeDateByTimeWithinDay(appointment.appointment_block.start_time).getTime() -
						startTime.getTime()
				) / configuration.timeIncrement;

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

	const gutterTopMargin = "6rem";

	function formatColumnDate(date: Date): string {
		return date.toLocaleString("en-US", {
			day: "2-digit",
			month: "2-digit"
		});
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
								<CalendarCardCarousel appointments={cellAppointments[i][j]} />
							</div>
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</CalendarGutter>
