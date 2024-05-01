<script lang="ts">
	import { WeekDay, type ExtendedAppointment } from "$lib/types";
	import { userName } from "$lib/utils";

	export let appointment: ExtendedAppointment;
	export let userID: string;

	$: appointmentBlock = appointment.appointment_block;
	$: instructionalMember = appointmentBlock.instructional_member;
	$: startTime = appointment.appointment_block.start_time;

	// console.log("instructional: " + appointment.appointment_block.instructional_member.user.id);
	// console.log("student: " + appointment.student.user.id);

	let endTime: Date;

	$: {
		endTime = new Date(startTime);
		endTime.setTime(endTime.getTime() + appointmentBlock.duration);
	}

	let date: string | Date;
	let currentDate = new Date();

	if (currentDate.getDay() == appointment.appointment_day.getDay()) {
		date = "Today";
	} else {
		date = appointment.appointment_day;
		date = date.toLocaleString("en-US", {
			month: "long",
			day: "numeric",
			year: "numeric"
		});
	}

	let subheadingDate = appointment.appointment_day;

	function getNumSuffix(i: number): string {
		let selected;

		if ((i > 3 && i < 21) || i % 10 > 3) {
			selected = 0;
		} else {
			selected = i % 10;
		}

		switch (selected) {
			case 0:
				return "th";
			case 1:
				return "st";
			case 2:
				return "nd";
			default:
				return "rd";
		}
	}

	const dateSuffix = getNumSuffix(subheadingDate.getDate());
	const weekdays = Object.values(WeekDay);
	const DayOfWeek = weekdays[subheadingDate.getDay()];
</script>

<div class="px-12">
	<p class="main-text font-kaisei pt-6">{date}:</p>
	<div class="flex flex-row py-4 items-center">
		{#if userID == instructionalMember.user.id}
			<div class="h-7 w-7 bg-calendar-card-3 rounded-lg"></div>
		{:else}
			<div class="h-7 w-7 bg-calendar-card-2 rounded-lg"></div>
		{/if}
		<div class="px-2">
			{#if userID == instructionalMember.user.id}
				<p class="main-text font-kaisei">
					Your Office Hours with {appointment.student.user.first_name}
					{appointment.student.user.last_name}
				</p>
			{:else}
				<p class="main-text font-kaisei">Office Hours with {userName(instructionalMember.user)}</p>
			{/if}
			<p class="main-text font-kaisei subtext capitalize">
				{DayOfWeek}, {subheadingDate.toLocaleDateString("en-US", {
					month: "long",
					day: "numeric"
				})}{dateSuffix}
			</p>
			<p class="main-text font-kaisei subtext">
				{startTime.toLocaleString("en-US", {
					timeStyle: "short"
				})} - {endTime.toLocaleString("en-US", {
					timeStyle: "short"
				})}
			</p>
		</div>
	</div>
</div>

<style>
	.main-text {
		font-size: 1rem;
	}

	.subtext {
		font-size: 0.75rem;
	}
</style>
