<script lang="ts">

    // We want this to display the classes in which an instructor teaches only
    // Instead of a booking button in the modal, point to the class overview page
    // import type { PartialCourse } from "$lib/types";
    
    // export let insCourse : PartialCourse;
    
    // $: name = insCourse.course_name;
    // $: dptName = insCourse.department_code;
    
    </script>
    
    <!-- Class Space -->
    <div class="flex flex-wrap space-x-5">
    
        <!-- Class Block -->
        <div class="bg-neutral w-fit h-fit p-4 rounded flex justify-between space-x-5">
    
            <!-- Dynamic: Name of Class and its Department Code -->
            <div class="flex space-x-2">
                <div>
                    <p class="p-1">ITSC 4681</p>
                </div>
                <div>
                    <p class="p-1">Senior Design I</p>
                </div>
            </div>
    
            <div class="flex rounded shadow-md p-1 bg-secondary pl-2 pr-2">
    
                <div>
                    <a class="text-white" href="/courses/[id]/sections/[id]">View Class</a>
                </div>
            </div>
    
        </div>
    </div>
        <!-- End Class Block -->



<!-- Below is the original code for the InstructorClass component with dynamic inserts -->

<!-- <script lang="ts">

    // We want this to display the classes in which an instructor teaches only
    // Instead of a booking button in the modal, point to the class overview page
    import type { PartialCourse } from "$lib/types";
    
    export let insCourse : PartialCourse;
    
    $: name = insCourse.course_name;
    $: dptName = insCourse.department_code;
    
    </script> -->
    
    <!-- Class Space -->
    <!-- <div class="flex flex-wrap space-x-5"> -->
    
        <!-- Class Block -->
        <!-- <div class="bg-neutral w-fit h-fit p-4 rounded flex justify-between space-x-5"> -->
    
            <!-- Dynamic: Name of Class and its Department Code -->
            <!-- <div class="flex space-x-2">
                <div>
                    <p class="p-1">{dptName}</p>
                </div>
                <div>
                    <p class="p-1">{name}</p>
                </div>
            </div>
    
            <div class="flex rounded shadow-md p-1 bg-secondary pl-2 pr-2">
    
                <div>
                    <a class="text-white" href="/courses/[id]/sections/[id]">View Class</a>
                </div>
            </div>
    
        </div>
    </div> -->
        <!-- End Class Block -->