<script lang="ts">
	import Calendar from "$lib/components/Calendar.svelte";

	const today = new Date();
	const month = today.toLocaleString("en-US", {
		month: "long"
	});

	const year = today.toLocaleString("en-US", {
		year: "numeric"
	});

	const subheading = today.toLocaleString("en-US", {
		day: "2-digit",
		month: "2-digit"
	});

	const calendarStartTime = new Date();

	calendarStartTime.setHours(9, 0, 0, 0);

	const calendarEndTime = new Date();

	calendarEndTime.setHours(17, 0, 0, 0);
</script>

<div>
	<div class="flex flex-col h-screen">
		<div class="px-6 py-2">
			<h1 class="heading">
				<span>{month}</span> <span class="text-primary">{year}</span>
			</h1>

			<h2 class="subheading text-primary">{subheading}</h2>
			<div class="divider divider-neutral my-2"></div>
		</div>

		<div class="grow min-h-0 p-4">
			<Calendar
				startTime={calendarStartTime}
				endTime={calendarEndTime}
				timeIncrement={1000 * 60 * 30} />
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
</div>
