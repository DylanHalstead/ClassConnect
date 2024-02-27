<script lang="ts">
	import { signOut } from "svelte-google-auth/client";
</script>

<div class="flex flex-col justify-between bg-primary w-16 h-screen items-center">
	<div>
		<nav class="flex flex-col items-center space-y-10">
			<div class="bg-white w-3/5 m-5 h-12 rounded-xl flex items-center justify-center">
				<div>
					<a class="text-2xl font-bold" href="/">CC</a>
				</div>
			</div>

			<div class="space-y-14">
				<div>
					<a href="/profile/[profileID]"
						><i class="fa-solid fa-user fa-xl" style="color: #ffffff;"></i></a>
				</div>
				<div>
					<a href="/calendar"
						><i class="fa-solid fa-calendar-days fa-xl" style="color: #ffffff;"></i></a>
				</div>
				<div>
					<a href="/courses/[courseID]/sections/[sectionID]/members/[memberID]/appointments/book"
						><i class="fa-solid fa-calendar-check fa-xl" style="color: #ffffff;"></i></a>
				</div>
			</div>
		</nav>
	</div>

	<div class="mb-5">
		<button on:click={() => signOut()}
			><i class="fa-solid fa-right-from-bracket fa-xl" style="color: #ffffff;"></i></button>
	</div>
</div>
