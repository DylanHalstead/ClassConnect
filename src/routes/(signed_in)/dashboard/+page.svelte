<script lang="ts">
	import BookingForm from "$lib/components/dashboard/BookingForm.svelte";
	import OfficeHourSummary from "$lib/components/dashboard/OfficeHourSummary.svelte";
	import { WeekDay } from "$lib/types";

	const currentDate = new Date();
	const dayNumber = currentDate.getDay();
	const weekdays = Object.values(WeekDay);
	const DayOfWeek = weekdays[dayNumber];

	const month = currentDate.toLocaleString("en-US", {
		month: "long"
	});

	const day = currentDate.toLocaleString("en-US", {
		day: "numeric"
	});

	const year = currentDate.toLocaleString("en-US", {
		year: "numeric"
	});

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

	const dateSuffix = getNumSuffix(currentDate.getDate());
</script>

<div class="px-12 py-2">
	<div class="flex flex-row w-full">
		<div class="flex justify-between w-full">
			<h1 class="main-text font-kaisei header capitalize">
				{DayOfWeek}, {month}
				{day}<sup class="text-primary">{dateSuffix}</sup>
			</h1>
			<h1 class="main-text font-kaisei header-year text-primary px-8">{year}</h1>
		</div>
	</div>

	<div class="border-t-4 border-solid border-gray-500 my-4 me-36"></div>

	<div class="px-12 py-6 mx-auto flex flex-row justify-center">
		<div class="appointment my-8 mx-auto">
			<h2 class="subheading main-text font-kaisei">Upcoming Appointments</h2>
			<OfficeHourSummary />
			<OfficeHourSummary />
			<OfficeHourSummary />
			<div class="mt-12">
				<h2 class="subheading main-text font-kaisei">TA Meetings:</h2>
				<OfficeHourSummary />
			</div>
		</div>

		<div class="divider divider-horizontal my-16 mx-auto"></div>

		<div class="booking form px-6 pt-24 flex flex-col mx-auto">
			<BookingForm />
		</div>
	</div>
</div>

<style>
	.main-text {
		font-size: 1rem;
	}

	.header,
	.header-year {
		font-weight: bold;
		font-size: 2.5rem;
	}

	.subheading {
		font-weight: bold;
		font-size: 1.75rem;
	}
</style>
