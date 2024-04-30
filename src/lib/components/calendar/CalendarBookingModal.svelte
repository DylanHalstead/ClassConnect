<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import Modal from "$lib/components/modal/Modal.svelte";
	import type { ExtendedAppointmentBlock, User } from "$lib/types";

	export let data:
		| {
				appointmentBlock: ExtendedAppointmentBlock;
				appointmentDate: Date;
		  }
		| undefined;

	export let isOpen: boolean;

	const dispatch = createEventDispatcher<{ close: undefined }>();

	function appointmentDateFormatted(appointmentDate: Date): string {
		return appointmentDate.toLocaleString("en-US", {
			dateStyle: "long"
		});
	}

	function appointmentBlockEndTimeFormatted(appointmentBlock: ExtendedAppointmentBlock): string {
		const endTime = new Date(appointmentBlock.start_time);

		endTime.setTime(endTime.getTime() + appointmentBlock.duration);

		return endTime.toLocaleString("en-US", {
			timeStyle: "short"
		});
	}

	function appointmentBlockInstructionalMember(appointmentBlock: ExtendedAppointmentBlock): User {
		return appointmentBlock.instructional_member.user;
	}

	function appointmentBlockStartTimeFormatted(appointmentBlock: ExtendedAppointmentBlock): string {
		return appointmentBlock.start_time.toLocaleString("en-US", {
			timeStyle: "short"
		});
	}
</script>

<Modal
	{isOpen}
	on:close={() => {
		dispatch("close");
	}}>
	{#if data != undefined}
		<h2 class="font-bold text-xl">
			Book an Appointment with {appointmentBlockInstructionalMember(data.appointmentBlock)
				.first_name}
			{appointmentBlockInstructionalMember(data.appointmentBlock).last_name}
		</h2>

		<h3 class="text-sm text-gray-600">
			{appointmentDateFormatted(data.appointmentDate)} from {appointmentBlockStartTimeFormatted(
				data.appointmentBlock
			)} to {appointmentBlockEndTimeFormatted(data.appointmentBlock)}
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
