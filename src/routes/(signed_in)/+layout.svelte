<script lang="ts">
	import { getFlash } from "sveltekit-flash-message";
	import { page } from "$app/stores";
	import Nav from "$lib/components/Nav.svelte";
	import { invalidateAll } from "$app/navigation";
	import { initialize } from "svelte-google-auth/client";

	import type { PageData } from "./$types.js";

	export let data: PageData;
	initialize(data, invalidateAll);

	const flash = getFlash(page, {
		clearAfterMs: 5000
	});
</script>

<div class="flex">
	<Nav data="data" />

	<div class="flex-1 ml-16">
		{#if $flash}
			<p>{$flash.message}</p>
		{/if}

		<slot />
	</div>
</div>
