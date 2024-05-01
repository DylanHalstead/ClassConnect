<script lang="ts">
	import "../app.css";
	import { invalidateAll } from "$app/navigation";
	import { initialize } from "svelte-google-auth/client";
	import type { LayoutData } from "./$types.js";
	import { title } from "$lib/stores";
	import Notification from "$lib/components/Notification.svelte";

	title.clear();

	export let data: LayoutData;
	initialize(data, invalidateAll);
</script>

<svelte:head>
	<title>{$title}</title>
</svelte:head>

<Notification />
<slot />
