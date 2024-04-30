<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import { isCalendarEventAppointmentBlock, type CalendarEvent } from "$lib/components/calendar";
	import type { ExtendedAppointmentBlock, ExtendedSectionMember } from "$lib/types";
	import { sectionName } from "$lib/utils";

	export let event: CalendarEvent;
	export let userID: string;
	export let collapsed: boolean;

	$: startTime = event.startTime;

	let endTime: Date;

	$: {
		endTime = new Date(startTime);
		endTime.setTime(endTime.getTime() + event.duration);
	}

	let title: string;

	$: {
		let sectionMember: ExtendedSectionMember;

		if (isCalendarEventAppointmentBlock(event.underlying)) {
			sectionMember = event.underlying.instructional_member;
		} else {
			sectionMember = event.underlying.student;
		}

		title = sectionName(sectionMember.section);
	}

	let subtitle: string;

	$: {
		if (isCalendarEventAppointmentBlock(event.underlying)) {
			const instructionalMemberUser = event.underlying.instructional_member.user;

			if (instructionalMemberUser.id == userID) {
				subtitle = "Your office hours";
			} else {
				subtitle = `${instructionalMemberUser.first_name} ${instructionalMemberUser.last_name}'s office hours`;
			}
		} else if (event.underlying.student.user.id == userID) {
			const instructionalMemberUser = event.underlying.appointment_block.instructional_member.user;

			subtitle = `Your booked appointment with ${instructionalMemberUser.first_name} ${instructionalMemberUser.last_name}`;
		} else {
			const studentUser = event.underlying.student.user;

			subtitle = `${studentUser.first_name} ${studentUser.last_name}'s booked appointment with you`;
		}
	}

	const dispatch = createEventDispatcher<{
		click: ExtendedAppointmentBlock;
	}>();
</script>

<button
	type="button"
	class="card bg-primary shadow text-left"
	class:calendar-card-collapsed={collapsed}
	on:click={() => {
		if (isCalendarEventAppointmentBlock(event.underlying)) {
			dispatch("click", event.underlying);
		}
	}}>
	<div class="card-body gap-0 p-4">
		<h3 class="calendar-card-section font-medium text-sm">{title}</h3>
		<div class="calendar-card-additional-container">
			<div class="calendar-card-additional">
				<h2 class="card-title text-sm">{subtitle}</h2>
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
</button>

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
