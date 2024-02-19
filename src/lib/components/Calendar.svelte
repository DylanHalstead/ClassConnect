<script lang="ts">
	import { onMount } from "svelte";

	export let startTime: Date;
	export let endTime: Date;
	export let timeIncrement: number;

	const rowCount = (endTime.getTime() - startTime.getTime()) / timeIncrement;
	const today = new Date();
	const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

	let container: HTMLDivElement;
	let gutter: HTMLDivElement;
	let firstGutterCellVisible = 0;
	let lastGutterCellVisible = rowCount - 1;

	function getRowTime(i: number): string {
		const result = new Date(startTime);

		result.setTime(result.getTime() + timeIncrement * i);

		return result.toLocaleString("en-US", {
			timeStyle: "short"
		});
	}

	function getColumnDate(i: number): string {
		const result = new Date(today);

		result.setTime(result.getTime() + (i - result.getDay()) * 24 * 60 * 60 * 1000);

		return result.toLocaleString("en-US", {
			day: "2-digit",
			month: "2-digit"
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

<style>
	* {
		--cell-height: 8rem;
		--gutter-width: 8rem;
	}

	.cell {
		height: var(--cell-height);
	}

	th.cell {
		height: auto;
	}

	.cell-header-weekday {
		font-family: 'Kaisei HarunoUmi', serif;
	}

	.gutter {
		width: var(--gutter-width);
	}

	.gutter-cell {
		font-family: 'Kaisei HarunoUmi', serif;
		height: var(--cell-height);
	}

	.gutter-cell::before {
		visibility: hidden;
	}

	.gutter-cell::after, .gutter-terminating-divider::before, .gutter-terminating-divider::after {
		background-color: oklch(var(--n));
		height: 1px;
	}

	.gutter-terminating-cell {
		width: var(--gutter-width);
		height: 0;
	}
</style>

<div class="flex flex-col h-full">
	<div
		class="flex grow overflow-y-scroll relative"
		bind:this={container}
		on:scroll={handleScroll}>
		<div class="gutter" bind:this={gutter}>
			{#each {length: rowCount} as _, i}
				<div class="gutter-cell divider m-0 {i >= firstGutterCellVisible && i <= lastGutterCellVisible ? "" : "invisible"}">
					<span class="gutter-cell-text">{getRowTime(i)}</span>
				</div>
			{/each}
		</div>

		<table class="border-separate border-spacing-0 table-fixed w-full">
			<thead>
				<tr>
					{#each {length: 7} as _, i}
						<th class="cell bg-base-100 border-neutral border-b border-s py-4 sticky top-0 {i == 6 ? "border-e" : ""}">
							<h2 class="cell-header-weekday text-2xl {i == today.getDay() ? "text-primary underline" : ""}">
								{weekdays[i]}
							</h2>

							<span class="text-base-content/50 text-sm">{getColumnDate(i)}</span>
						</th>
					{/each}
				</tr>
			</thead>

			<tbody>
				{#each {length: rowCount} as _, i}
					<tr>
						{#each {length: 7} as _, j}
							<td class="cell border-neutral border-s {i < rowCount - 1 ? "border-b" : ""} {j == 6 ? "border-e" : ""}"></td>
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
