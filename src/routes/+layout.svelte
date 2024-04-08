<script lang="ts">
	import { initialize } from "svelte-google-auth/client";
	import { invalidateAll } from "$app/navigation";
	import Notification from "$lib/components/Notification.svelte";
	import type { PageData } from "./$types.js";
	import "../app.css";

	export let data: PageData;
	initialize(data, invalidateAll);
</script>

<Notification />
<slot />
