<div class="cursor-container flex items-center h-0">
	<div class="bg-primary w-3 h-3 rounded-full" />
	<div class="cursor-divider divider h-0 m-0 self-auto w-full" />
</div>

<style>
	.cursor-container {
		margin-left: -0.375rem;
	}

	.cursor-divider::before,
	.cursor-divider::after {
		background-color: oklch(var(--p));
	}
</style>
