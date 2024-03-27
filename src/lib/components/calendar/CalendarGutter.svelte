<script lang="ts">
	import { onMount } from "svelte";
	import { normalizeDateByTimeWithinDay } from "$lib/datemanipulation";

	/**
	 * The minimum time to display on a given day.
	 */
	export let startTime: Date;

	const normalizedStartTime = normalizeDateByTimeWithinDay(startTime);

	/**
	 * The maximum time to display on a given day.
	 */
	export let endTime: Date;

	const normalizedEndTime = normalizeDateByTimeWithinDay(endTime);

	/**
	 * The length of time, in milliseconds, that a cell on the gutter measures.
	 */
	export let timeIncrement: number;

	/**
	 * The height of each gutter cell as a CSS expression.
	 *
	 * Note: Don't provide any user-supplied values here, since this is vulnerable to injection.
	 */
	export let gutterCellHeight: string;

	/**
	 * The `margin-top` of the gutter as a CSS expression.
	 *
	 * Note: Don't provide any user-supplied values here, since this is vulnerable to injection.
	 */
	export let gutterTopMargin: string;

	const rowCount = (normalizedEndTime.getTime() - normalizedStartTime.getTime()) / timeIncrement;

	let container: HTMLDivElement;
	let gutter: HTMLDivElement;
	let firstGutterCellVisible = 0;
	let lastGutterCellVisible = rowCount - 1;

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
		<div
			class="gutter shrink-0"
			style:margin-top={`calc(${gutterTopMargin} - (${gutterCellHeight}) / 2 - 1px)`}
			bind:this={gutter}>
			{#each { length: rowCount } as _, i}
				<div
					class="gutter-cell divider font-kaisei m-0"
					class:invisible={i < firstGutterCellVisible || i > lastGutterCellVisible}
					style:height={`calc(${gutterCellHeight} + 1px`}>
					<span class="gutter-cell-text">{getFormattedRowTime(i)}</span>
				</div>
			{/each}
		</div>

		<slot />
	</div>

	<div class="flex">
		<div class="gutter-cell gutter-terminating-cell divider font-kaisei m-0">
			{getFormattedRowTime(lastGutterCellVisible + 1)}
		</div>

		<div class="gutter-terminating-divider divider grow m-0 h-0"></div>
	</div>
</div>

<style>
	* {
		--gutter-width: 7.5rem;
	}

	.gutter {
		width: var(--gutter-width);
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
