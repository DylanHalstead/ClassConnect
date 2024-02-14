<script lang="ts">
	import { getFlash } from 'sveltekit-flash-message';
	import { page } from '$app/stores';

	const flash = getFlash(page, {
		clearAfterMs: 5000
	});
</script>

<nav>
	<a href="/">Dashboard</a>
	<a href="/profile/[id]">Profile</a>
	<a href="/calendar">Calendar</a>
	<a href="/courses/[id]/sections/[id]/members/[id]/appointments/book">Book</a>
</nav>

{#if $flash}
	<p>{$flash.message}</p>
{/if}

<slot />
