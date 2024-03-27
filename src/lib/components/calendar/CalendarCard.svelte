<script lang="ts">
	import type { ExtendedAppointment } from "$lib/types";
	import { sectionName, userName } from "$lib/utils";

	export let appointment: ExtendedAppointment;
	export let collapsed: boolean;

	$: appointmentBlock = appointment.appointment_block;
	$: instructionalMember = appointmentBlock.instructional_member;
	$: startTime = appointment.appointment_block.start_time;

	let endTime: Date;

	$: {
		endTime = new Date(startTime);
		endTime.setTime(endTime.getTime() + appointmentBlock.duration);
	}
</script>

<div class="card bg-primary shadow" class:calendar-card-collapsed={collapsed}>
	<div class="card-body gap-0 p-4">
		<h3 class="calendar-card-section font-medium text-sm">
			{sectionName(instructionalMember.section)}
		</h3>

		<div class="calendar-card-additional-container">
			<div class="calendar-card-additional">
				<h2 class="card-title text-sm">
					Office Hours with {userName(instructionalMember.user)}
				</h2>

				<p class="text-sm">
					{startTime.toLocaleString("en-US", {
						timeStyle: "short"
					})} - {endTime.toLocaleString("en-US", {
						timeStyle: "short"
					})}
				</p>
			</div>
		</div>
	</div>
</div>

<style>
	* {
		--animation-duration: 0.2s;
	}

	@keyframes calendar-card-section-in {
		from {
			font-size: 0.875rem;
		}

		to {
			font-size: 0.75rem;
		}
	}

	@keyframes calendar-card-section-out {
		from {
			font-size: 0.75rem;
		}

		to {
			font-size: 0.875rem;
		}
	}

	.calendar-card-collapsed:hover {
		z-index: 100;
	}

	.calendar-card-collapsed:hover .calendar-card-additional {
		visibility: visible;
	}

	.calendar-card-collapsed:hover .calendar-card-additional-container {
		grid-template-rows: 1fr;
	}

	.calendar-card-collapsed:hover .calendar-card-section {
		animation: calendar-card-section-in var(--animation-duration) ease;
		font-size: 0.75rem;
	}

	.calendar-card-collapsed .calendar-card-additional {
		min-height: 0;
		overflow: hidden;
		transition: visibility var(--animation-duration);
		visibility: hidden;
	}

	.calendar-card-collapsed .calendar-card-additional-container {
		display: grid;
		grid-template-rows: 0fr;
		transition: grid-template-rows var(--animation-duration);
	}

	.calendar-card-collapsed .calendar-card-section {
		animation: calendar-card-section-out var(--animation-duration) ease;
	}
</style>
