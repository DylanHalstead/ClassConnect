<script lang="ts">
	import type { CalendarEvent } from "$lib/components/calendar";
	import type { ExtendedAppointmentBlock } from "$lib/types";
	import { createEventDispatcher } from "svelte";
	import CalendarCard from "./CalendarCard.svelte";

	export let events: CalendarEvent[];
	export let userID: string;

	const dispatch = createEventDispatcher<{
		click: {
			appointmentBlock: ExtendedAppointmentBlock;
			appointmentDate: Date;
		};
	}>();
</script>

<div class="flex flex-col gap-2">
	{#each events as calendarEvent}
		<CalendarCard
			event={calendarEvent}
			{userID}
			collapsed={events.length > 1}
			on:click={event =>
				dispatch("click", {
					appointmentBlock: event.detail,
					appointmentDate: calendarEvent.date
				})} />
	{/each}
</div>
