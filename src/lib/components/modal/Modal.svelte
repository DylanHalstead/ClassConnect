<script lang="ts">
	let modalDialog: HTMLDialogElement;

	export function open() {
		modalDialog.showModal();
	}
</script>

<dialog bind:this={modalDialog} class="modal">
	<div class="modal-box">
		<form method="dialog">
			<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
		</form>
		<slot />
	</div>
</dialog>
