<script lang="ts">
	import "../app.css"
	import { getFlash } from "sveltekit-flash-message";
	import { page } from "$app/stores";
	import { invalidateAll } from "$app/navigation";
	import { initialize } from "svelte-google-auth/client";
	import type { PageData } from "./$types.js";

	export let data: PageData;
	initialize(data, invalidateAll);

	const flash = getFlash(page, {
		clearAfterMs: 5000
	});
</script>

{#if $flash}
	<p>{$flash.message}</p>
{/if}

<slot />
