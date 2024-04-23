<script lang="ts">

    import type { ExtendedAppointment } from "$lib/types";
    import { sectionName, userName } from "$lib/utils";

    let appointment: ExtendedAppointment;

    $: appointmentBlock = appointment.appointment_block;
	$: instructionalMember = appointmentBlock.instructional_member;
	$: startTime = appointment.appointment_block.start_time;

 </script>
 
 <!-- Appointment Space -->
 <div class="flex space-x-5">

    <!-- Appointment Block -->
    <div class="bg-secondary w-fit h-fit p-4 rounded">

        <!-- Name of TA -->
        <p class='font-bold mb-1'>Office Hours with {userName(instructionalMember.user)}</p>

        <!-- Class of Appointment -->
        <p class="text-sm">{sectionName(instructionalMember.section)}</p>

        <!-- Time of Appointment -->
        <p class="text-sm">{startTime.toLocaleString("en-US", {
            timeStyle: "short"
        })}</p>

        <!-- Unique Zoom Link -->
        <a class="text-sm" href={appointment.link}><u>{appointment.link}</u></a>

    </div>
</div>
    <!-- End Appointment Block -->