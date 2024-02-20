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

        <!-- Appointment Space -->
        <div class="flex space-x-5">

            <!-- Appointment Block -->
            <div class="bg-secondary w-fit h-fit p-4 rounded">

                <!-- Dynamic: Name of TA -->
                <p class='font-bold mb-1'>Office Hours with [TA NAME]</p>

                <!-- Dynamic: Date of Appointment -->
                <p class="text-sm">[FULL DATE]</p>

                <!-- Dynamic: Time of Appointment -->
                <p class="text-sm">[TIME]</p>

                <!-- Dynamic: Unique Zoom Link -->
                <a class="text-sm" href=""><u>[ZOOM LINK?]</u></a>
    
            </div>
            <!-- End Appointment Block -->

            <!-- Example -->
            <div class="bg-success w-fit h-fit p-4 rounded">

                <!-- Dynamic: Name of TA -->
                <p class='font-bold mb-1'>Office Hours with TA Dylan</p>

                <!-- Dynamic: Date of Appointment -->
                <p class="text-sm">Monday, February 19th</p>

                <!-- Dynamic: Time of Appointment -->
                <p class="text-sm">1:00-2:00 PM</p>

                <!-- Dynamic: Unique Zoom Link -->
                <a class="text-sm" href=""><u>https://zoom.com/id</u></a>
    
            </div>

        </div>

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

        <!-- Class Space -->
        <div class="flex flex-wrap space-x-5">

            <!-- Class Block -->
            <div class="bg-info w-fit h-fit p-4 rounded flex justify-between space-x-5">

                <!-- Dynamic: Name of Class -->
                <div>
                    <p class="p-1">[CLASS NAME]</p>
                </div>

                <div class="flex space-x-1 border rounded border-black p-1">
                    <div>
                        <i class="fa-solid fa-plus"></i>
                    </div>

                    <div>
                        <a href="/courses/[id]/sections/[id]/members/[id]/appointments/book">Book</a>
                    </div>
                </div>
    
            </div>
            <!-- End Class Block -->

        </div>

    </div>
</div>