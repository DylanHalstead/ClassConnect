<script lang="ts">

    // import type { ExtendedAppointment } from "$lib/types";
    // import { sectionName, userName } from "$lib/utils";

    // export let appointment: ExtendedAppointment;

    // $: appointmentBlock = appointment.appointment_block;
	// $: instructionalMember = appointmentBlock.instructional_member;
	// $: startTime = appointment.appointment_block.start_time;

 </script>
 
 <!-- Appointment Space -->
 <div class="flex space-x-5">

    <!-- Appointment Block -->
    <div class="bg-secondary w-fit h-fit p-4 rounded">

        <!-- Name of TA -->
        <p class='font-bold mb-1'>Office Hours with Dylan Halstead</p>

        <!-- Class of Appointment -->
        <p class="text-sm">ITSC 3155 - Software Engineering</p>

        <!-- Time of Appointment -->
        <p class="text-sm">12:00 - 1:00 PM</p>

        <!-- Unique Zoom Link -->
        <a class="text-sm" href="#"><u>Zoom Link</u></a>

    </div>
</div>
    <!-- End Appointment Block -->


    <!-- Below is the original code for the Appointment component with dynamic inserts -->

    <!-- <script lang="ts">

        import type { ExtendedAppointment } from "$lib/types";
        import { sectionName, userName } from "$lib/utils";
    
        export let appointment: ExtendedAppointment;
    
        $: appointmentBlock = appointment.appointment_block;
        $: instructionalMember = appointmentBlock.instructional_member;
        $: startTime = appointment.appointment_block.start_time;
    
     </script> -->
     
     <!-- Appointment Space -->
     <!-- <div class="flex space-x-5"> -->
    
        <!-- Appointment Block -->
        <!-- <div class="bg-secondary w-fit h-fit p-4 rounded"> -->
    
            <!-- Name of TA -->
            <!-- <p class='font-bold mb-1'>Office Hours with {userName(instructionalMember.user)}</p> -->
    
            <!-- Class of Appointment -->
            <!-- <p class="text-sm">{sectionName(instructionalMember.section)}</p> -->
    
            <!-- Time of Appointment -->
            <!-- <p class="text-sm">{startTime.toLocaleString("en-US", {
                timeStyle: "short"
            })}</p> -->
    
            <!-- Unique Zoom Link -->
            <!-- <a class="text-sm" href={appointment.link}><u>{appointment.link}</u></a>
    
        </div> 
    </div> -->
        <!-- End Appointment Block -->