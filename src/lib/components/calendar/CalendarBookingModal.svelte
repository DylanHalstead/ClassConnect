<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import Modal from "$lib/components/modal/Modal.svelte";
	import type { ExtendedAppointment, User } from "$lib/types";

	export let appointment: ExtendedAppointment | undefined;
	export let isOpen: boolean;

	const dispatch = createEventDispatcher<{ close: undefined }>();

	function appointmentDateFormatted(appointment: ExtendedAppointment): string {
		return appointment.appointment_day.toLocaleString("en-US", {
			dateStyle: "long"
		});
	}

	function appointmentEndTimeFormatted(appointment: ExtendedAppointment): string {
		const endTime = new Date(appointment.appointment_block.start_time);

		endTime.setTime(endTime.getTime() + appointment.appointment_block.duration);

		return endTime.toLocaleString("en-US", {
			timeStyle: "short"
		});
	}

	function appointmentInstructionalMember(appointment: ExtendedAppointment): User {
		return appointment.appointment_block.instructional_member.user;
	}

	function appointmentStartTimeFormatted(appointment: ExtendedAppointment): string {
		return appointment.appointment_block.start_time.toLocaleString("en-US", {
			timeStyle: "short"
		});
	}
</script>

<Modal
	{isOpen}
	on:close={() => {
		dispatch("close");
	}}>
	{#if appointment != undefined}
		<h2 class="font-bold text-xl">
			Book an Appointment with {appointmentInstructionalMember(appointment).first_name}
			{appointmentInstructionalMember(appointment).last_name}
		</h2>

		<h3 class="text-sm text-gray-600">
			{appointmentDateFormatted(appointment)} from {appointmentStartTimeFormatted(appointment)} to {appointmentEndTimeFormatted(
				appointment
			)}
		</h3>
	{/if}

	<div class="flex justify-end w-full">
		<button
			type="button"
			class="btn btn-primary"
			on:click={() => {
				dispatch("close");
			}}>
			Submit
		</button>
	</div>
</Modal>
