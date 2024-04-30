<script lang="ts">
    import Appointment from "$lib/components/profile/Appointment.svelte";
    import Class from "$lib/components/profile/Class.svelte";
    import type { PartialAppointment } from "$lib/types";
    import type { ExtendedAppointment } from "$lib/types";
    import type { User } from "$lib/types";
    import type { PartialCourse } from "$lib/types";

    import { type ExtendedSectionMember, SectionMemberType } from "$lib/types";

    import type { PageData } from "./$types.js";

    export let member: ExtendedSectionMember;
    export let data: PageData;

    let course: Array<PartialCourse>;
    let appointment: Array<PartialAppointment>;
    let associated: User['id'];
</script>

<div class="flex flex-col m-12 space-y-14">

    <!-- User Info Hero -->
    <div class="flex space-x-5">
        <!-- profile image -->
        <div>
            <img class="rounded-full w-40 h-40" src={data.auth.user.picture} alt="Placeholder">
        </div>

        <!-- Name of User and Email -->
        <div class="flex flex-col space-y-3 justify-center">
            <div class="flex space-x-2">
                <div>
                    <h1 class="text-2xl font-bold">{data.auth.user.name}</h1>
                </div>
            </div>
            <div>
                <h3 class="text-lg">{data.auth.user.email}</h3>
            </div>

        </div>

    </div>

    <div class="flex items-center">
        <div class="flex w-4/5 border-t-4 border-primary"></div>
    </div>

    <!--  {{ Appointments : Students and TAs }} -->

    <!-- {{ Student Appointments }} -->
    {#if member.member_type === SectionMemberType.Student}
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

        <div class="flex flex-wrap space-x-7">
            {#each appointment as apt}
                {#if apt.student_id == associated}
                    <div>
                        <Appointment appointment={apt}/>
                    </div>
                {/if}
            {/each}
        </div>

    </div>

    {/if}
    
    <!-- {{ TA Appointments: With students and with other TAs }} -->
    {#if member.member_type === SectionMemberType.TA}

    <div class="flex flex-col space-y-10">

        <div class="flex flex-col">
            <div>
                <h1 class="text-2xl font-bold">Student Appointments</h1>
            </div>
            <div>
                <h3 class="text-lg">Upcoming Meetings with Students</h3>
            </div>
        </div>

        <!-- Appointemnt Components -->

        <div class="flex flex-wrap space-x-7">
            {#each appointment as apt}
                {#if apt.student_id == associated}
                    <div>
                        <Appointment />
                    </div>
                {/if}
            {/each}
        </div>

    </div>

    <!-- Also show the TA their appointments as a student themself -->
    <div class="flex flex-col space-y-10">

        <div class="flex flex-col">
            <div>
                <h1 class="text-2xl font-bold">My Appointments</h1>
            </div>
            <div>
                <h3 class="text-lg">Upcoming Meeting</h3>
            </div>
        </div>

        <!-- Appointemnt Components -->

        <div class="flex flex-wrap space-x-7">
            {#each appointment as apt}
                {#if apt.student_id == associated}
                    <div>
                        <Appointment />
                    </div>
                {/if}
            {/each}
        </div>

    </div>
                    
    {/if}

    <!-- {{ Classes : Students, TAs, Instructors }} -->

    <!-- {{ Student Classes }} -->
    {#if member.member_type === SectionMemberType.Student}

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

        <div class="flex flex-wrap space-x-7">
            {#each course as crs}
                <div>
                    <Class departmentCode={crs.department_code} className={crs.course_name}/>
                </div>
            {/each}
        </div>

    </div>

    {/if}

    <!-- {{ TA Classes: Section 1 = Classes they TA for // Section 2 = Classes they are enrolled in as a student }}-->
    {#if member.member_type === SectionMemberType.TA}

    <div class="flex flex-col space-y-10">

        <div class="flex flex-col">
            <div>
                <h1 class="text-2xl font-bold">TA Classes</h1>
            </div>
            <div>
                <h3 class="text-lg">View Classes you TA for Here</h3>
            </div>
        </div>

        <!-- Class Components | TODO: Loop TA TA classes -->

        <div class="flex flex-wrap space-x-7">
            {#each course as crs}
                <div>
                    <Class departmentCode={crs.department_code} className={crs.course_name}/>
                </div>
            {/each}
        </div>

    </div>

    <div class="flex flex-col space-y-10">

        <div class="flex flex-col">
            <div>
                <h1 class="text-2xl font-bold">My Classes</h1>
            </div>
            <div>
                <h3 class="text-lg">Book Appointments with a TA</h3>
            </div>
        </div>

        <!-- Class Components | TODO: Loop TA Student Classes -->

        <div class="flex flex-wrap space-x-7">
            {#each course as crs}
                <div>
                    <Class departmentCode={crs.department_code} className={crs.course_name}/>
                </div>
            {/each}
        </div>

    </div>

    {/if}

    <!-- {{ Instructor Classes: Shows classes they teach }}-->
    {#if member.member_type === SectionMemberType.Instructor}

    <div class="flex flex-col space-y-10">

        <div class="flex flex-col">
            <div>
                <h1 class="text-2xl font-bold">Instructional Classes</h1>
            </div>
            <div>
                <h3 class="text-lg">View Classes you Instruct Here</h3>
            </div>
        </div>

        <!-- Class Components TODO: Loop classes instructor teaches -->

        <div class="flex flex-wrap space-x-7">
            {#each course as crs}
                <div>
                    <Class departmentCode={crs.department_code} className={crs.course_name}/>
                </div>
            {/each}
        </div>

    </div>

    {/if}
    
</div>