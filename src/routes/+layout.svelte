<script lang="ts">
	import { getFlash } from 'sveltekit-flash-message';
	import { page } from '$app/stores';

	const flash = getFlash(page);
</script>

{#if $flash}
	<p>{$flash.message}</p>
{/if}

<slot />
