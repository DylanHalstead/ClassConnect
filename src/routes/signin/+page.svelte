<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { initialize } from 'svelte-google-auth/client';
	import type { PageData } from './$types.js';

	import GoogleSignIn from '$lib/components/GoogleSignIn.svelte';
	import GoogleSignOut from '$lib/components/GoogleSignOut.svelte';

	export let data: PageData;
	initialize(data, invalidateAll);
</script>

<!-- if not user, show login button, otherwise show details -->
{#if !data.auth.user}
	<GoogleSignIn />
{:else}
	<p>Welcome, {data.auth.user.name}</p>
	<p>{data.auth.user.email}</p>
	<p>{data.db.user.id}</p>
	<GoogleSignOut />
{/if}
