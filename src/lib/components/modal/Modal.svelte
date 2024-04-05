<script lang="ts">
	import { createEventDispatcher, onDestroy } from "svelte";

	export let isOpen: boolean;
	
	let wasOpen = isOpen;
	let modal: HTMLDialogElement;
	const dispatch = createEventDispatcher<{ close: undefined }>();
	
	$: {
		if (modal != undefined) {
			const closeHandler = (event: Event) => {
				dispatch("close");
				event.preventDefault();
			};

			modal.addEventListener("close", closeHandler);
			modal.addEventListener("close", closeHandler);
			onDestroy(() => {
				modal.removeEventListener("close", closeHandler);
			});
		}
	}

	$: {
		if (!wasOpen && isOpen) {
			modal.showModal();
		} else if (wasOpen && !isOpen) {
			modal.close();
		}
		wasOpen = isOpen;
	}
</script>

<dialog bind:this={modal} class="modal">
	<div class="modal-box">
		<form method="dialog">
			<button on:click={() => dispatch("close")} class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
		</form>
		<slot />
	</div>
</dialog>
