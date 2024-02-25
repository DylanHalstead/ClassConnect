<script lang="ts">
	import { cn } from "$lib/utils/cn";
	import { Motion } from "svelte-motion";
	export let className = "";
	export let tabs: {
		title: string;
		value: string;
		content: string;
	}[];
	export let hovering: boolean = false;
	const isActive = (tab: { title: string; value: string; content: string }) => {
		return tab.value === tabs[0].value;
	};
</script>

<div class="relative h-full w-full">
	{#each tabs as tab, idx (tab.value)}
		<Motion
			let:motion
			layoutId={tab.value}
			animate={{
				y: isActive(tab) ? [0, 40, 0] : 0
			}}>
			<div
				use:motion
				style={`scale: ${1 - idx * 0.1}; top: ${hovering ? `${idx * -50}px` : 0}; z-index: ${-idx}; opacity: ${idx < 3 ? 1 - idx * 0.1 : 0};`}
				class={cn("absolute left-0 top-0 h-full w-full overflow-hidden", className)}>
				{@html tab.content}
			</div>
		</Motion>
	{/each}
</div>
