<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import { ArrowLeft, ArrowRight, Icon } from "svelte-hero-icons";
	import { normalizeDateByWeek } from ".";

	/**
	 * The date whose week the calendar is currently focused on.
	 *
	 * @see {@link $lib/components/calendar/Calendar.svelte}'s `week` prop for more information.
	 */
	export let week: Date;

	$: weekNormalizedByDate = normalizeDateByWeek(week);
	$: date = weekNormalizedByDate.getDate();

	let dateOptions: number[];

	$: {
		dateOptions = [];

		const current = new Date(weekNormalizedByDate);

		current.setDate(1);

		const end = new Date(current);

		end.setMonth(end.getMonth() + 1);

		while (current.getTime() < end.getTime()) {
			dateOptions.push(current.getDate());
			current.setDate(current.getDate() + 1);
		}
	}

	$: monthName = weekNormalizedByDate.toLocaleString("en-US", {
		month: "long"
	});

	$: year = weekNormalizedByDate.getFullYear();

	const dispatch = createEventDispatcher<{
		changeWeek: Date;
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
		const result = new Date(week);

		result.setTime(result.getTime() - 1000 * 60 * 60 * 24 * 7);

		dispatch("changeWeek", result);
	}

	function handleRightButtonClick() {
		const result = new Date(week);

		result.setTime(result.getTime() + 1000 * 60 * 60 * 24 * 7);

		dispatch("changeWeek", result);
	}

	function handleDateChange(event: Event & { currentTarget: HTMLSelectElement }) {
		const result = new Date(weekNormalizedByDate);

		result.setDate(parseInt(event.currentTarget.value));

		dispatch("changeWeek", normalizeDateByWeek(result));
	}

	function handleMonthChange(event: Event & { currentTarget: HTMLSelectElement }) {
		const i = months.get(event.currentTarget.value);

		if (i != undefined) {
			const result = new Date(weekNormalizedByDate);

			result.setMonth(i);

			dispatch("changeWeek", result);
		}
	}

	function handleYearChange(event: Event & { currentTarget: HTMLInputElement }) {
		const i = event.currentTarget.valueAsNumber;

		if (!isNaN(i)) {
			const result = new Date(weekNormalizedByDate);

			result.setFullYear(i);

			dispatch("changeWeek", result);
		}
	}
</script>

<div class="flex items-center">
	<select class="select select-bordered me-1" value={monthName} on:change={handleMonthChange}>
		{#each months as [month, _]}
			<option>{month}</option>
		{/each}
	</select>

	<select class="select select-bordered me-1" value={date} on:change={handleDateChange}>
		{#each dateOptions as date}
			<option>{date}</option>
		{/each}
	</select>

	<input
		type="number"
		class="input input-bordered me-3 w-28"
		value={year}
		on:change={handleYearChange} />

	<button type="button" class="btn btn-circle btn-sm me-2" on:click={handleLeftButtonClick}>
		<Icon size="24" src={ArrowLeft} />
	</button>

	<button type="button" class="btn btn-circle btn-sm" on:click={handleRightButtonClick}>
		<Icon size="24" src={ArrowRight} />
	</button>
</div>
