<script lang="ts">
	import { getFlash } from "sveltekit-flash-message";
	import { page } from "$app/stores";
	import { slide } from "svelte/transition";
	import { quintInOut } from "svelte/easing";
	import { Icon, CheckCircle, ExclamationCircle, InformationCircle } from "svelte-hero-icons";

	const flash = getFlash(page);

	const notifcationType = {
		success: {
			classNames: "bg-green-100/75 border-success text-success",
			icon: CheckCircle
		},
		error: {
			classNames: "bg-red-100/75 border-error text-error",
			icon: ExclamationCircle
		},
		info: {
			classNames: "bg-teal-100/75 border-info text-info",
			icon: InformationCircle
		}
	};
	let currentType = notifcationType["info"];

	let isVisible = false;
	const incomingDelay = 100;
	const dismissDelay = 3000;
	$: if ($flash) {
		setTimeout(() => {
			isVisible = true;
		}, incomingDelay);

		currentType = notifcationType[$flash.type];

		setTimeout(() => {
			isVisible = false;
			$flash = undefined;
		}, dismissDelay);
	}
</script>

{#if isVisible && $flash}
	<dialog
		transition:slide={{ delay: 100, duration: 200, easing: quintInOut, axis: "y" }}
		class={`flex items-center justify-center w-fit backdrop-blur-md rounded-md text-sm p-1 fixed m-auto left-0 right-0 top-4 z-50 border-2 ${currentType.classNames}`}>
		<Icon src={currentType.icon} class="w-6 h-6" />
		<p class="ml-2 mr-1">{$flash.message}</p>
		<button on:click={() => (isVisible = false)} class="btn btn-sm btn-circle btn-ghost">✕</button>
	</dialog>
{/if}
