<script lang="ts">
	import { CalendarMode } from "$lib/components/calendar";
	import CalendarBookingModal from "$lib/components/calendar/CalendarBookingModal.svelte";
	import CalendarControls from "$lib/components/calendar/CalendarControls.svelte";
	import CalendarDaily from "$lib/components/calendar/CalendarDaily.svelte";
	import Header from "$lib/components/Header.svelte";
	import CalendarWeekly from "$lib/components/calendar/CalendarWeekly.svelte";
	import { AppointmentBlockBooking, type ExtendedAppointmentBlock } from "$lib/types";
	import type { PageData } from "./$types";

	export let data: PageData;

	const calendarStartTime = new Date();

	calendarStartTime.setHours(9, 0, 0, 0);

	const calendarEndTime = new Date();

	calendarEndTime.setHours(17, 0, 0, 0);

	let calendarDate = new Date();
	let calendarMode = CalendarMode.Weekly;

	$: calendarConfiguration = {
		appointments: data.appointments,
		appointmentBlocks: data.appointmentBlocks,
		currentDate: calendarDate,
		gutterCellHeight: "8rem",
		maximumStartTime: calendarStartTime,
		minimumEndTime: calendarEndTime,
		timeIncrement: 30 * 60 * 1000,
		userID: data.userID
	};

	let bookingModalData:
		| {
				appointmentBlock: ExtendedAppointmentBlock;
				appointmentDate: Date;
		  }
		| undefined;

	let bookingModalOpen = false;

	function handleAppointmentClick(
		event: CustomEvent<{ appointmentBlock: ExtendedAppointmentBlock; appointmentDate: Date }>
	) {
		bookingModalData = event.detail;
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
				on:click={event => handleAppointmentClick(event)} />
		{:else}
			<CalendarWeekly
				configuration={calendarConfiguration}
				on:click={event => handleAppointmentClick(event)} />
		{/if}
	</div>
</div>

<CalendarBookingModal
	data={bookingModalData}
	isOpen={bookingModalOpen}
	on:close={async booked => {
		bookingModalOpen = false;

		if (!booked.detail || bookingModalData == undefined) {
			return;
		}

		const section = bookingModalData.appointmentBlock.instructional_member.section;

		await fetch(`/courses/${section.course.id}/sections/${section.id}/appointments`, {
			body: JSON.stringify(
				AppointmentBlockBooking.encode({
					appointmentBlockId: bookingModalData.appointmentBlock.id,
					appointmentDate: bookingModalData.appointmentDate
				})
			),

			headers: {
				"Content-Type": "application/json"
			},

			method: "POST"
		});

		window.location.reload();
	}} />
