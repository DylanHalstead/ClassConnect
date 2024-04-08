<script lang="ts">
	import { initialize } from "svelte-google-auth/client";
	import { getFlash } from "sveltekit-flash-message";
	import { invalidateAll } from "$app/navigation";
	import { page } from "$app/stores";
	import type { PageData } from "./$types.js";
	import "../app.css";

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
