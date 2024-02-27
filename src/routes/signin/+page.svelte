<script lang="ts">
	import { invalidateAll } from "$app/navigation";
	import { initialize } from "svelte-google-auth/client";
	import type { PageData } from "./$types.js";

	import GoogleSignIn from "$lib/components/authentication/GoogleSignIn.svelte";
	import GoogleSignOut from "$lib/components/authentication/GoogleSignOut.svelte";

	export let data: PageData;
	initialize(data, invalidateAll);
</script>

<!-- if not user, show login button, otherwise show details -->
{#if !data.db}
	<GoogleSignIn />
{:else}
	<p>Welcome, {data.db.user.first_name} {data.db.user.last_name}</p>
	<p>{data.db.user.email}</p>
	<p>{data.db.user.id}</p>
	<p>{data.auth.user?.picture}</p>
	<GoogleSignOut />
{/if}
