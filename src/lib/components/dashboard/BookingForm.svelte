<script lang="ts">
	// Blockers 
	// booking form missing time selector
	// Or a pop up for picking a time for that specified TA.

	let classes = [
		{
			id: 1,
			text: "Course #1"
		},
		{
			id: 2,
			text: "Course #2"
		},
		{
			id: 3,
			text: "Course #3"
		},
		{
			id: 4,
			text: "Course #4"
		},
		{
			id: 5,
			text: "Course #5"
		}
	];

	let selectedClass: any;
	let chosenClass = "";

	let tas = [
		{
			id: 1,
			text: "TA Example 1"
		},
		{
			id: 2,
			text: "TA Example 2"
		},
		{
			id: 3,
			text: "TA Example 3"
		}
	];

	let selectedTA: any;
	let chosenTA = "";
</script>

<h2 class="subheading main-text text-center">Book Now</h2>
<form action="" class="form-control w-80">
	<label for="name" class="main-text mt-4">Name:</label>
	<input
		type="text"
		class="input-sm rounded-md bg-gray-200 input-bordered w-full max-w-xs text-black mt-1"
		placeholder="John Doe" />

	<label for="email" class="main-text mt-4">Email:</label>
	<input
		type="text"
		class="input-sm rounded-md bg-gray-200 input-bordered w-full max-w-xs text-black mt-1"
		placeholder="example@uncc.edu" />

	<label for="date" class="main-text mt-4">Date:</label>
	<input
		type="date"
		class="input-sm rounded-md bg-gray-200 input-bordered w-full max-w-xs text-black mt-1" />

	<label for="class" class="main-text mt-4">Course:</label>
	<select
		name="courses"
		id="courses"
		class="input-sm rounded-md bg-gray-200 input-bordered w-full max-w-xs text-black mt-1"
		value={selectedClass}
		on:change={() => chosenClass}>
		{#each classes as course}
			<option value={course}>
				{course.text}
			</option>
		{/each}
	</select>

	<label for="ta" class="main-text mt-4">TA:</label>
	<select
		name="ta"
		id="ta"
		class="input-sm rounded-md bg-gray-200 input-bordered w-full max-w-xs text-black mt-1"
		value={selectedTA}
		on:change={() => chosenTA}>
		{#each tas as ta}
			<option value={ta}>
				{ta.text}
			</option>
		{/each}
	</select>

	<button class="btn btn-primary btn-sm text-base-100 main-text mt-4 mx-20 rounded-md">
		Submit
	</button>
</form>

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
