<script lang="ts">
	import { getFlash } from "sveltekit-flash-message";
	import { page } from "$app/stores";
	import "../app.css";

	const flash = getFlash(page, {
		clearAfterMs: 5000
	});
</script>

{#if $flash}
	<p>{$flash.message}</p>
{/if}

<slot />
