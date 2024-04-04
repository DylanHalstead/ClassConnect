<script lang="ts">
	import "../app.css";
	import { invalidateAll } from "$app/navigation";
	import { initialize } from "svelte-google-auth/client";

	import type { LayoutData } from "./$types.js";

	export let data: LayoutData;
	initialize(data, invalidateAll);
</script>

<slot />
