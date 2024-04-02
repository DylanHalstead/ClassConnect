<script lang="ts">
	import type { ExtendedAppointment } from "$lib/types";
	import { createEventDispatcher } from "svelte";
	import CalendarCard from "./CalendarCard.svelte";

	export let appointments: ExtendedAppointment[];

	const dispatch = createEventDispatcher<{
		appointmentClicked: ExtendedAppointment;
	}>();
</script>

<div class="flex flex-col gap-2">
	{#each appointments as appointment}
		<CalendarCard
			{appointment}
			collapsed={appointments.length > 1}
			on:click={() => dispatch("appointmentClicked", appointment)} />
	{/each}
</div>
