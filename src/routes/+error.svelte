<script lang="ts">
	import { page } from "$app/stores";
	import { title } from "$lib/stores";

	title.set(`Error: ${$page.status}`);
</script>

<div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
	<h1 class="text-9xl font-black text-primary">{$page.status}</h1>

	<h2 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">Uh-oh!</h2>

	<p class="mt-4 text-gray-500">
		{$page.error ? $page.error.message : `We're not quite sure what went wrong :(`}
	</p>

	<a href="/" class="btn btn-primary mt-6">Go Back Home</a>
</div>
