<script lang="ts">
	import { onMount } from "svelte";
	import {
		normalizeDateByDay,
		normalizeDateByTimeWithinDay,
		normalizeDateByWeek,
	} from "$lib/utils";
	import type { ExtendedAppointment}  from "$lib/types";
	import CalendarCardCarousel from "$lib/components/calendar/CalendarCardCarousel.svelte";

	/**
	 * The date whose week the calendar will be focused on. Note that if the date's day is one other
	 * than the start of the week, its day will be set to the start of the week so the calendar
	 * doesn't display two weeks at once.
	 */
	export let week: Date;

	$: weekNormalized = normalizeDateByWeek(week);

	/**
	 * The minimum time to display on a given day.
	 */
	export let maximumStartTime: Date;

	/**
	 * The maximum time to display on a given day.
	 */
	export let minimumEndTime: Date;

	/**
	 * The length of time, in milliseconds, that a cell on the calendar measures.
	 */
	export let timeIncrement: number;
	export let appointments: ExtendedAppointment[];

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

	let container: HTMLDivElement;
	let gutter: HTMLDivElement;
	let firstGutterCellVisible = 0;
	let lastGutterCellVisible = rowCount - 1;

	function formatColumnDate(date: Date): string {
		return date.toLocaleString("en-US", {
			day: "2-digit",
			month: "2-digit"
		});
	}

	function getFormattedRowTime(i: number): string {
		const result = normalizeDateByTimeWithinDay(startTime);

		result.setTime(result.getTime() + timeIncrement * i);

		return result.toLocaleString("en-US", {
			timeStyle: "short"
		});
	}

	function handleScroll() {
		const gutterCells = gutter.getElementsByClassName("gutter-cell");
		let newFirstVisible = rowCount;
		let newLastVisible = -1;

		for (let i = 0; i < gutterCells.length; i++) {
			if (isGutterCellVisible(gutterCells[i])) {
				newFirstVisible = i;

				break;
			}
		}

		for (let i = gutterCells.length - 1; i >= 0; i--) {
			if (isGutterCellVisible(gutterCells[i])) {
				newLastVisible = i;

				break;
			}
		}

		firstGutterCellVisible = newFirstVisible;
		lastGutterCellVisible = newLastVisible;
	}

	function isGutterCellVisible(cell: Element): boolean {
		const containerTop = container.scrollTop;
		const containerBottom = containerTop + container.clientHeight;
		const cellText = cell.querySelector(".gutter-cell-text");

		if (!(cellText instanceof HTMLElement)) {
			return false;
		}

		const cellTop = cellText.offsetTop;
		const cellBottom = cellTop + cellText.clientHeight;

		return cellTop >= containerTop && cellBottom <= containerBottom;
	}

	onMount(() => handleScroll());
</script>

<div class="flex flex-col h-full">
	<div class="flex grow overflow-y-scroll relative" bind:this={container} on:scroll={handleScroll}>
		<div class="gutter" bind:this={gutter}>
			{#each { length: rowCount } as _, i}
				<div
					class="gutter-cell divider m-0"
					class:invisible={i < firstGutterCellVisible || i > lastGutterCellVisible}>
					<span class="gutter-cell-text">{getFormattedRowTime(i)}</span>
				</div>
			{/each}
		</div>

		<table class="border-separate border-spacing-0 table-fixed w-full">
			<thead>
				<tr>
					{#each columnDates as date, i}
						{@const isToday = date.getTime() == today.getTime()}

						<th
							class="cell bg-base-100 border-neutral border-b border-s sticky top-0 z-10"
							class:border-e={i == 6}>
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
								class="cell border-neutral border-s p-0"
								class:border-b={i < rowCount - 1}
								class:border-e={j == 6}>
								<div class="card-carousel-container overflow-y-scroll p-2">
									<CalendarCardCarousel appointments={cellAppointments[i][j]} />
								</div>
							</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<div class="flex">
		<div class="gutter-cell gutter-terminating-cell divider m-0">
			{getFormattedRowTime(lastGutterCellVisible + 1)}
		</div>

		<div class="gutter-terminating-divider divider m-0 w-full h-0"></div>
	</div>
</div>

<style>
	* {
		--cell-height: 8rem;
		--gutter-top-margin: 6rem;
		--gutter-width: 8rem;
	}

	.card-carousel-container {
		height: var(--cell-height);
	}

	th.cell {
		height: var(--gutter-top-margin);
	}

	.cell-header-weekday {
		font-family: "Kaisei HarunoUmi", serif;
	}

	.gutter {
		margin-top: calc(var(--gutter-top-margin) - var(--cell-height) / 2 - 1px);
		width: var(--gutter-width);
	}

	.gutter-cell {
		font-family: "Kaisei HarunoUmi", serif;
		height: calc(var(--cell-height) + 1px);
	}

	.gutter-cell::before {
		visibility: hidden;
	}

	.gutter-cell::after,
	.gutter-terminating-divider::before,
	.gutter-terminating-divider::after {
		background-color: oklch(var(--n));
		height: 1px;
	}

	.gutter-terminating-cell {
		width: var(--gutter-width);
		height: 0;
	}
</style>
