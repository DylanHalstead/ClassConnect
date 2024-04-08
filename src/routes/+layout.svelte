<script lang="ts">
	import "../app.css";
	import { invalidateAll } from "$app/navigation";
	import { initialize } from "svelte-google-auth/client";
	import type { LayoutData } from "./$types.js";
	import Notification from "$lib/components/Notification.svelte";
	import "../app.css";

	export let data: LayoutData;
	initialize(data, invalidateAll);
</script>

<Notification />
<slot />
