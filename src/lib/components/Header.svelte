<script lang="ts">
	import { WeekDay } from "$lib/types";
	import { getNumSuffix } from "$lib/utils";

	const currentDate = new Date();
	const dayNumber = currentDate.getDay();
	const weekdays = Object.values(WeekDay);
	const DayOfWeek = weekdays[dayNumber];

	const month = currentDate.toLocaleString("en-US", {
		month: "long"
	});

	const day = currentDate.toLocaleString("en-US", {
		day: "numeric"
	});

	const year = currentDate.toLocaleString("en-US", {
		year: "numeric"
	});

	const dateSuffix = getNumSuffix(currentDate.getDate());

	export let layout: string;
</script>

<div>
	<div class="px-12 py-2">
		{#if layout == "calendar"}
			<div class="flex flex-row justify-between">
				<div class="flex flex-col items-start">
					<h1 class="header-year font-bold font-kaisei">
						<span>{month}</span> <span class="text-primary">{year}</span>
					</h1>
					<h2 class="subheading font-bold font-kaisei text-primary text-xl">{month}/{day}</h2>
				</div>
				<slot />
			</div>
		{:else}
			<div class="header-component">
				<div class="flex flex-row w-full">
					<div class="flex justify-between w-full">
						<h1 class="main-text header capitalize">
							{DayOfWeek}, {month}
							{day}<sup class="text-primary">{dateSuffix}</sup>
						</h1>
						<h1 class="main-text header-year text-primary px-8">{year}</h1>
					</div>
				</div>
			</div>
		{/if}
		<div class="border-t-4 border-solid border-gray-500 my-4 me-36"></div>
	</div>
</div>

<style>
	.main-text {
		font-family: "Kaisei HarunoUmi", serif;
		font-size: 1rem;
	}

	.header,
	.header-year {
		font-weight: bold;
		font-size: 2.5rem;
	}
</style>
