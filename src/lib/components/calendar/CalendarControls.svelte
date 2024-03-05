<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import { ArrowLeft, ArrowRight, Icon } from "svelte-hero-icons";
	import { normalizeDateByDay, normalizeDateByWeek } from "$lib/utils";
	import { CalendarMode } from "$lib/components/calendar";

	/**
	 * The date the calendar is currently focused on.
	 *
	 * @see {@link $lib/components/calendar/CalendarWeekly.svelte}'s `week` prop for more
	 * information.
	 */
	export let currentDate: Date;
	export let mode: CalendarMode;

	$: dateNormalized =
		mode == CalendarMode.Daily ? normalizeDateByDay(currentDate) : normalizeDateByWeek(currentDate);

	let dateOptions: number[];

	$: {
		dateOptions = [];

		const current = new Date(dateNormalized);

		current.setDate(1);

		const end = new Date(current);

		end.setMonth(end.getMonth() + 1);

		while (current.getTime() < end.getTime()) {
			dateOptions.push(current.getDate());
			current.setDate(current.getDate() + 1);
		}
	}

	$: directionalButtonTimeDelta =
		mode == CalendarMode.Daily ? 1000 * 60 * 60 * 24 : 1000 * 60 * 60 * 24 * 7;

	const dispatch = createEventDispatcher<{
		changeWeek: Date;
		changeMode: CalendarMode;
	}>();

	const months = new Map<string, number>(
		[
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December"
		].map((monthName, i) => [monthName, i])
	);

	function handleLeftButtonClick() {
		const result = new Date(currentDate);

		result.setTime(result.getTime() - directionalButtonTimeDelta);

		dispatch("changeWeek", result);
	}

	function handleRightButtonClick() {
		const result = new Date(currentDate);

		result.setTime(result.getTime() + directionalButtonTimeDelta);

		dispatch("changeWeek", result);
	}

	function handleDateChange(event: Event & { currentTarget: HTMLSelectElement }) {
		const result = new Date(dateNormalized);

		result.setDate(parseInt(event.currentTarget.value));

		dispatch("changeWeek", result);
	}

	function handleModeChange(event: Event & { currentTarget: HTMLSelectElement }) {
		dispatch(
			"changeMode",
			event.currentTarget.value == CalendarMode.Daily ? CalendarMode.Daily : CalendarMode.Weekly
		);
	}

	function handleMonthChange(event: Event & { currentTarget: HTMLSelectElement }) {
		const i = months.get(event.currentTarget.value);

		if (i != undefined) {
			const result = new Date(dateNormalized);

			result.setMonth(i);

			dispatch("changeWeek", result);
		}
	}

	function handleYearChange(event: Event & { currentTarget: HTMLInputElement }) {
		const i = event.currentTarget.valueAsNumber;

		if (!isNaN(i)) {
			const result = new Date(dateNormalized);

			result.setFullYear(i);

			dispatch("changeWeek", result);
		}
	}
</script>

<div class="flex flex-col items-end">
	<select class="select bg-secondary mb-1.5 rounded-full" value={mode} on:change={handleModeChange}>
		<option value={CalendarMode.Daily}>Daily</option>
		<option value={CalendarMode.Weekly}>Weekly</option>
	</select>

	<div class="flex items-center">
		<select
			class="select select-bordered me-1"
			value={dateNormalized.toLocaleString("en-US", {
				month: "long"
			})}
			on:change={handleMonthChange}>
			{#each months as [month, _]}
				<option>{month}</option>
			{/each}
		</select>

		<select
			class="select select-bordered me-1"
			value={dateNormalized.getDate()}
			on:change={handleDateChange}>
			{#each dateOptions as date}
				<option>{date}</option>
			{/each}
		</select>

		<input
			type="number"
			class="input input-bordered me-3 w-28"
			value={dateNormalized.getFullYear()}
			on:change={handleYearChange} />

		<button type="button" class="btn btn-circle btn-sm me-2" on:click={handleLeftButtonClick}>
			<Icon size="24" src={ArrowLeft} />
		</button>

		<button type="button" class="btn btn-circle btn-sm" on:click={handleRightButtonClick}>
			<Icon size="24" src={ArrowRight} />
		</button>
	</div>
</div>
