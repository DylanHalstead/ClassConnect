<script lang="ts">
	import BookingForm from "$lib/components/dashboard/BookingForm.svelte";
	import OfficeHourSummary from "$lib/components/dashboard/OfficeHourSummary.svelte";
	import Header from "$lib/components/Header.svelte";
</script>

<div class="px-12 py-2">
	<Header layout="" />

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
		font-family: "Kaisei HarunoUmi", serif;
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
