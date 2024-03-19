<script lang="ts">
	import { onMount } from "svelte";
	import { normalizeDateByDay, normalizeDateByWeek } from "$lib/components/calendar";

	/**
	 * The date whose week the calendar will be focused on. Note that if the date's day is one other
	 * than the start of the week, its day will be set to the start of the week so the calendar
	 * doesn't display two weeks at once.
	 */
	export let week: Date;

	/**
	 * The minimum time to display on a given day.
	 */
	export let startTime: Date;

	/**
	 * The maximum time to display on a given day.
	 */
	export let endTime: Date;

	/**
	 * The length of time, in milliseconds, that a cell on the calendar measures.
	 */
	export let timeIncrement: number;

	const rowCount = (endTime.getTime() - startTime.getTime()) / timeIncrement;
	const today = normalizeDateByDay(new Date());
	const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

	let columnDates: Date[];

	$: {
		columnDates = [];

		const current = normalizeDateByWeek(week);

		for (let i = 0; i < 7; i++) {
			columnDates.push(new Date(current));
			current.setTime(current.getTime() + 24 * 60 * 60 * 1000);
		}
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

	function getRowTime(i: number): string {
		const result = new Date(startTime);

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
					class="gutter-cell divider m-0 {i >= firstGutterCellVisible && i <= lastGutterCellVisible
						? ''
						: 'invisible'}">
					<span class="gutter-cell-text">{getRowTime(i)}</span>
				</div>
			{/each}
		</div>

		<table class="border-separate border-spacing-0 table-fixed w-full">
			<thead>
				<tr>
					{#each columnDates as date, i}
						<th
							class="cell bg-base-100 border-neutral border-b border-s sticky top-0 {i == 6
								? 'border-e'
								: ''}">
							<h2
								class="cell-header-weekday text-2xl {date.getTime() == today.getTime()
									? 'text-primary underline'
									: ''}">
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
								class="cell border-neutral border-s {i < rowCount - 1 ? 'border-b' : ''} {j == 6
									? 'border-e'
									: ''}"></td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<div class="flex">
		<div class="gutter-cell gutter-terminating-cell divider m-0">
			{getRowTime(lastGutterCellVisible + 1)}
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

	.cell {
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
		height: var(--cell-height);
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
