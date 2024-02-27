<script lang="ts">
    import Appointment from "$lib/components/Appointment.svelte";
    import Class from "$lib/components/Class.svelte";
</script>

<div class="flex flex-col m-12 space-y-14">

    <!-- User Info Hero -->
    <div class="flex space-x-5">
        <!-- profile image -->
        <div>
            <img class="rounded" src="#" alt="Placeholder">
        </div>

        <!-- Name of User and Email -->
        <div class="flex flex-col space-y-3">
            <div>
                <h1 class="text-2xl font-bold">Example User</h1>
            </div>
            <div>
                <h3 class="text-lg">Example Email</h3>
            </div>
        </div>

    </div>

    <!-- Appointments : Students and TAs -->

    <div class="flex flex-col space-y-10">

        <div class="flex flex-col">
            <div>
                <h1 class="text-2xl font-bold">My Appointments</h1>
            </div>
            <div>
                <h3 class="text-lg">Upcoming Meetings</h3>
            </div>
        </div>

        <!-- Appointemnt Components -->

        <Appointment />
        <!-- name={taName}
			date={fullDate}
			time={appTime}
            zoom={zoomLink} -->

    </div>

    <!-- Classes : Students and TAs -->

    <div class="flex flex-col space-y-10">

        <div class="flex flex-col">
            <div>
                <h1 class="text-2xl font-bold">My Classes</h1>
            </div>
            <div>
                <h3 class="text-lg">Book Appointments with a TA</h3>
            </div>
        </div>

        <!-- Class Components -->

        <Class />
        <!-- name={className}
			book={bookingLink} -->

    </div>
</div>