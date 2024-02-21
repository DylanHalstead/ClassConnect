<script lang="ts">
	import { getFlash } from "sveltekit-flash-message";
	import { page } from "$app/stores";
	import "../app.css";
	import Nav from "$lib/components/Nav.svelte";

	const flash = getFlash(page, {
		clearAfterMs: 5000
	});
</script>

<div class="flex">
	<div>
		<Nav/>
	</div>

{#if $flash}
	<p>{$flash.message}</p>
{/if}

<slot />

</div>