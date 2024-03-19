<script lang="ts">
	import { normalizeDateByDay, normalizeDateByWeek } from "$lib/datemanipulation";
	import { CalendarMode } from "$lib/components/calendar";

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

<h1 class="heading font-bold font-kaisei">
	<span>{month}</span> <span class="text-primary">{year}</span>
</h1>

<h2 class="subheading font-bold font-kaisei text-primary text-xl">{subheading}</h2>

<style>
	.heading {
		font-size: 2.5rem;
	}
</style>
