<script lang="ts">
	import CalendarCard from "$lib/components/calendar/CalendarCard.svelte";
	import type { ExtendedAppointment } from ".";

	export let appointments: ExtendedAppointment[];
</script>

<div class="flex flex-col gap-2">
	{#each appointments as appointment}
		<CalendarCard {appointment} collapsed={appointments.length > 1} />
	{/each}
</div>
