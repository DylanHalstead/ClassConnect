<script lang="ts">
	import { WeekDay } from '$lib/types';
	import { invalidateAll } from '$app/navigation';
	import { initialize } from 'svelte-google-auth/client';
	import type { PageData } from './$types.js';

	export let data: PageData;
	initialize(data, invalidateAll);
</script>

<div class="p-4">
	<h1 class="text-4xl mb-4">Create Appointment Block</h1>
	<form method="POST">
		<div class="inline-block">
			<label for="day-of-week">Day of Week</label>
			<select
				class="capitalize select select-bordered w-full max-w-xs mb-4"
				name="day-of-week"
				id="day-of-week"
				required
			>
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
					required
				/>
			</div>
			<div class="inline-block">
				<label for="end-time">End Time</label>
				<input
					class="input input-bordered w-full max-w-xs"
					type="time"
					name="end-time"
					id="end-time"
					required
				/>
			</div>
		</div>

		<button class="btn btn-outline btn-primary" type="submit">Create Block</button>
	</form>
</div>
