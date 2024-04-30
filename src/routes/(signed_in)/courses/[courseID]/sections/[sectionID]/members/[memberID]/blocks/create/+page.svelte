<script lang="ts">
	import { WeekDay } from "$lib/types";
	import { invalidateAll } from "$app/navigation";
	import { initialize } from "svelte-google-auth/client";
	import type { PageData } from "./$types.js";
	import { title } from "$lib/stores";

	export let data: PageData;
	initialize(data, invalidateAll);

  title.set(`${data.section.course.department_code} ${data.section.course.course_code}-${data.section.section_number} | Create Appointment Block`);

	let selectedWeekday: WeekDay | null = null;
	let startTime: string = "";
	let endTime: string = "";
	let isValid: boolean = false;
	let areDatesValid: boolean = false;

	function validateDates() {
		const splitStartTime = startTime.split(":");
		const splitEndTime = endTime.split(":");
		if (
			splitStartTime[0] === undefined ||
			splitStartTime[1] === undefined ||
			splitEndTime[0] === undefined ||
			splitEndTime[1] === undefined
		) {
			areDatesValid = false;
			return;
		}

		const startHour = parseInt(splitStartTime[0]);
		const startMinute = parseInt(splitStartTime[1]);
		const endHour = parseInt(splitEndTime[0]);
		const endMinute = parseInt(splitEndTime[1]);

		areDatesValid = startHour < endHour || (startHour === endHour && startMinute < endMinute);
	}

	function validateForm() {
		validateDates();
		isValid = selectedWeekday !== null && areDatesValid;
	}
</script>

<div class="p-4">
	<h1 class="text-4xl mb-4">Create Appointment Block</h1>
	<form method="POST" on:change|preventDefault={validateForm}>
		<div class="inline-block">
			<label for="day-of-week">Day of Week</label>
			<select
				class="capitalize select select-bordered w-full max-w-xs mb-4"
				name="day-of-week"
				id="day-of-week"
				bind:value={selectedWeekday}
				required>
				{#each Object.values(WeekDay) as weekday}
					<option value={weekday}>{weekday}</option>
				{/each}
			</select>
		</div>

		<div class="mb-4">
			<div class="inline-block mr-2">
				<label for="start-time">Start Time</label>
				<input
					class="input input-bordered w-full max-w-xs"
					type="time"
					name="start-time"
					id="start-time"
					bind:value={startTime}
					required />
			</div>
			<div class="inline-block">
				<label for="end-time">End Time</label>
				<input
					class="input input-bordered w-full max-w-xs"
					type="time"
					name="end-time"
					id="end-time"
					bind:value={endTime}
					required />
			</div>
			{#if startTime !== "" && endTime !== "" && !areDatesValid}
				<p class="text-red-500">End time must be after start time</p>
			{/if}
		</div>

		<button class="btn btn-outline btn-primary" type="submit" disabled={!isValid}
			>Create Block</button>
	</form>
</div>
