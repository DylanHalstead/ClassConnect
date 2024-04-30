<script lang="ts">

    //import type { PartialCourse } from "$lib/types";
    //let course: PartialCourse;

    export let departmentCode = "unknown";
    export let className = 'unknown';

</script>

<!-- Class Space -->
<div class="flex flex-wrap space-x-5">

    <!-- Class Block -->
    <div class="bg-neutral w-fit h-fit p-4 rounded flex justify-between space-x-5">

        <!-- Dynamic: Name of Class and its Department Code -->
        <div class="flex space-x-2">
            <div>
                <p class="p-1">{departmentCode}</p>
            </div>
            <div>
                <p class="p-1">{className}</p>
            </div>
        </div>

        <div class="flex rounded shadow-md p-1 bg-secondary pl-2 pr-2">

            <div>
                <a class="text-white" href="/courses/[id]/sections/[id]/members/[id]/appointments/book">+ Book</a>
            </div>
        </div>

    </div>
</div>
    <!-- End Class Block -->