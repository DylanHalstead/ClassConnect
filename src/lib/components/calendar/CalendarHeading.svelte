<script lang="ts">
	import { normalizeDateByDay, normalizeDateByWeek } from "$lib/datemanipulation";
	import { CalendarMode } from ".";

	export let date: Date;
	export let mode: CalendarMode;

	$: dateNormalized =
		mode == CalendarMode.Daily ? normalizeDateByDay(date) : normalizeDateByWeek(date);

	$: month = dateNormalized.toLocaleString("en-US", {
		month: "long"
	});

	$: year = dateNormalized.toLocaleString("en-US", {
		year: "numeric"
	});

	$: subheading = dateNormalized.toLocaleString("en-US", {
		day: "2-digit",
		month: "2-digit"
	});
</script>

<h1 class="heading">
	<span>{month}</span> <span class="text-primary">{year}</span>
</h1>

<h2 class="subheading text-primary">{subheading}</h2>

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
