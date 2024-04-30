<script lang="ts">
	import { CalendarMode } from "$lib/components/calendar";
	import CalendarBookingModal from "$lib/components/calendar/CalendarBookingModal.svelte";
	import CalendarControls from "$lib/components/calendar/CalendarControls.svelte";
	import CalendarDaily from "$lib/components/calendar/CalendarDaily.svelte";
	import Header from "$lib/components/Header.svelte";
	import CalendarWeekly from "$lib/components/calendar/CalendarWeekly.svelte";
	import {
		SectionMemberType,
		WeekDay,
		type InstructionalMember,
		type Student,
		type ExtendedAppointment
	} from "$lib/types";
	import { title } from "$lib/stores";

	title.set("Calendar");
	import type { PageData } from "./$types";

	export let data: PageData;

	const calendarStartTime = new Date();

	calendarStartTime.setHours(9, 0, 0, 0);

	const calendarEndTime = new Date();

	calendarEndTime.setHours(17, 0, 0, 0);

	let calendarDate = new Date();
	let calendarMode = CalendarMode.Weekly;

	$: calendarConfiguration = {
		currentDate: calendarDate,
		maximumStartTime: calendarStartTime,
		minimumEndTime: calendarEndTime,
		timeIncrement: 30 * 60 * 1000,
		appointments: data.appointments,
		gutterCellHeight: "8rem"
	};

	let bookingAppointment: ExtendedAppointment | undefined;
	let bookingModalOpen = false;

	function handleAppointmentClicked(event: CustomEvent<ExtendedAppointment>) {
		bookingAppointment = event.detail;
		bookingModalOpen = true;
	}
</script>

<div class="flex flex-col h-screen">
	<Header layout="calendar">
		<CalendarControls
			currentDate={calendarDate}
			mode={calendarMode}
			on:changeWeek={event => (calendarDate = event.detail)}
			on:changeMode={event => (calendarMode = event.detail)} />
	</Header>

	<div class="grow min-h-0 p-4">
		{#if calendarMode == CalendarMode.Daily}
			<CalendarDaily
				configuration={calendarConfiguration}
				on:appointmentClicked={event => handleAppointmentClicked(event)} />
		{:else}
			<CalendarWeekly
				configuration={calendarConfiguration}
				on:appointmentClicked={event => handleAppointmentClicked(event)} />
		{/if}
	</div>
</div>

<CalendarBookingModal
	appointment={bookingAppointment}
	isOpen={bookingModalOpen}
	on:close={() => (bookingModalOpen = false)} />
