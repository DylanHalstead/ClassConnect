<script lang="ts">
	import CalendarControls from "$lib/components/calendar/CalendarControls.svelte";
	import CalendarDaily from "$lib/components/calendar/CalendarDaily.svelte";
	import CalendarHeading from "$lib/components/calendar/CalendarHeading.svelte";
	import {
		CalendarMode,
		type ExtendedAppointment,
		type InstructionalMember,
		type Student
	} from "$lib/components/calendar/index";

	import CalendarWeekly from "$lib/components/calendar/CalendarWeekly.svelte";
	import { SectionMemberType, WeekDay } from "$lib/types";

	const calendarStartTime = new Date();

	calendarStartTime.setHours(9, 0, 0, 0);

	const calendarEndTime = new Date();

	calendarEndTime.setHours(17, 0, 0, 0);

	let calendarDate = new Date();
	let calendarMode = CalendarMode.Weekly;

	// TODO: Replace with real data
	const course = {
		id: "1",
		department_code: "ITSC",
		course_code: "3155",
		course_name: "Software Engineering"
	};

	const user = {
		id: "1",
		email: "jadenpeterson150@gmail.com",
		first_name: "Jaden",
		last_name: "Peterson"
	};

	const section = {
		id: "1",
		course: course,
		section_number: 3155,
		max_daily_bookable_hours: Infinity
	};

	const instructionalMember: InstructionalMember = {
		id: "1",
		section: section,
		user: user,
		member_type: SectionMemberType.TA,
		is_restricted: false
	};

	const student: Student = {
		...instructionalMember,

		member_type: SectionMemberType.Student
	};

	const appointmentBlock = {
		id: "1",
		instructional_member: instructionalMember,
		week_day: WeekDay.Monday,
		start_time: calendarStartTime,
		duration: 1000 * 60 * 30
	};

	const partialAppointment = {
		appointment_day: calendarStartTime,
		appointment_block: appointmentBlock,
		student: student,
		cancelled: false,
		link: ""
	};

	const appointments: ExtendedAppointment[] = [
		{
			...partialAppointment,

			id: "1"
		},

		{
			...partialAppointment,

			id: "2"
		}
	];

	$: calendarConfiguration = {
		currentDate: calendarDate,
		maximumStartTime: calendarStartTime,
		minimumEndTime: calendarEndTime,
		timeIncrement: 30 * 60 * 1000,
		appointments: appointments,
		gutterCellHeight: "8rem"
	};
</script>

<div class="flex flex-col h-screen">
	<div class="px-6 py-2">
		<div class="flex justify-between items-end">
			<div>
				<CalendarHeading date={calendarDate} mode={calendarMode} />
			</div>

			<CalendarControls
				currentDate={calendarDate}
				mode={calendarMode}
				on:changeWeek={event => (calendarDate = event.detail)}
				on:changeMode={event => (calendarMode = event.detail)} />
		</div>
		<div class="divider divider-neutral my-2"></div>
	</div>

	<div class="grow min-h-0 p-4">
		{#if calendarMode == CalendarMode.Daily}
			<CalendarDaily configuration={calendarConfiguration} />
		{:else}
			<CalendarWeekly configuration={calendarConfiguration} />
		{/if}
	</div>
</div>
