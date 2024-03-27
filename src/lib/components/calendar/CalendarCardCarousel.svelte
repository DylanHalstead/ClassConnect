<script lang="ts">
	import type { ExtendedAppointment } from "$lib/types";
	import CalendarCard from "./CalendarCard.svelte";

	export let appointments: ExtendedAppointment[];
</script>

<div class="flex flex-col gap-2">
	{#each appointments as appointment}
		<CalendarCard {appointment} collapsed={appointments.length > 1} />
	{/each}
</div>
