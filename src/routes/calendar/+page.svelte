<script lang="ts">
	import Calendar from "$lib/components/calendar/Calendar.svelte";
	import {
		normalizeDateByWeek,
		type ExtendedAppointment,
		type InstructionalMember,
		type Student
	} from "$lib/components/calendar/index";

	import CalendarControls from "$lib/components/calendar/CalendarControls.svelte";
	import { SectionMemberType, WeekDay } from "$lib/types";

	const calendarStartTime = new Date();

	calendarStartTime.setHours(9, 0, 0, 0);

	const calendarEndTime = new Date();

	calendarEndTime.setHours(17, 0, 0, 0);

	let calendarWeek = normalizeDateByWeek(new Date());

	$: month = calendarWeek.toLocaleString("en-US", {
		month: "long"
	});

	$: year = calendarWeek.toLocaleString("en-US", {
		year: "numeric"
	});

	$: subheading = calendarWeek.toLocaleString("en-US", {
		day: "2-digit",
		month: "2-digit"
	});

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
</script>

<div class="flex flex-col h-screen">
	<div class="px-6 py-2">
		<div class="flex justify-between items-end">
			<div>
				<h1 class="heading">
					<span>{month}</span> <span class="text-primary">{year}</span>
				</h1>

				<h2 class="subheading text-primary">{subheading}</h2>
			</div>

			<CalendarControls
				week={calendarWeek}
				on:changeWeek={event => (calendarWeek = event.detail)} />
		</div>
		<div class="divider divider-neutral my-2"></div>
	</div>

	<div class="grow min-h-0 p-4">
		<Calendar
			week={calendarWeek}
			startTime={calendarStartTime}
			endTime={calendarEndTime}
			timeIncrement={1000 * 60 * 30}
			{appointments} />
	</div>
</div>

<style>
	.heading,
	.subheading {
		font-family: "Kaisei HarunoUmi", serif;
		font-weight: bold;
	}

	.heading {
		font-size: 2.5rem;
	}

	.subheading {
		font-size: 1.25rem;
	}
</style>
