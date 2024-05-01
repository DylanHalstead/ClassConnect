<script lang="ts">
	import BookingForm from "$lib/components/dashboard/BookingForm.svelte";
	import OfficeHourSummary from "$lib/components/dashboard/OfficeHourSummary.svelte";
	import Header from "$lib/components/Header.svelte";
	import { initialize } from "svelte-google-auth/client";
	import type { PageData } from "./$types.js";
	import { invalidateAll } from "$app/navigation";
	import { title } from "$lib/stores";

	title.set("Dashboard");

	export let data: PageData;
	initialize(data, invalidateAll);
	$: appointments = {
		studentAppointments: data.studentAppointments,
		taAppointments: data.taAppointments,
	};

	let userID: string;

	userID = data.userID;



	
</script>

<div class="px-12 py-2">
	<Header layout="" />

	<div class="px-12 py-6 mx-auto flex flex-row justify-center">
		<div class="appointment my-8 mx-auto">
			<h2 class="subheading main-text font-kaisei">Upcoming Appointments</h2>
				{#each appointments.studentAppointments as appointment}
					<OfficeHourSummary appointment={appointment} userID = {userID} />
				{/each}
			<div class="mt-12">
				<h2 class="subheading main-text font-kaisei">TA Meetings:</h2>
				{#each appointments.taAppointments as appointment}
					<OfficeHourSummary appointment={appointment} userID = {userID} />
				{/each}
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

	.subheading {
		font-weight: bold;
		font-size: 1.75rem;
	}
</style>
