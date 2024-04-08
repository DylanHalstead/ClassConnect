<script lang="ts">
	import Nav from "$lib/components/Nav.svelte";
	import { invalidateAll } from "$app/navigation";
	import { initialize } from "svelte-google-auth/client";

	import type { PageData } from "./$types.js";

	export let data: PageData;
	initialize(data, invalidateAll);

</script>

<div class="flex">
	<Nav data="data" />

	<div class="flex-1 ml-16">
		

		<slot />
	</div>
</div>
