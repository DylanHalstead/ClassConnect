<script lang="ts">
	import { cn } from "$lib/utils/cn";
	import { Motion } from "svelte-motion";
	import FadeInDiv from "./FadeInDiv.svelte";
	export let propTabs: {
		title: string;
		value: string;
		content: string;
	}[] = [];
	export let containerClassName = "";
	export let activeTabClassName = "";
	export let tabClassName = "";
	export let contentClassName = "";
	export let activeTabTextClassName = "";
	let active = propTabs[0];
	let tabs = propTabs;
	const moveSelectedTabToTop = (idx: number) => {
		const newTabs = [...propTabs];
		const selectedTab = newTabs.splice(idx, 1);
		newTabs.unshift(selectedTab[0]);
		tabs = newTabs;
		active = newTabs[0];
	};
	let hovering = false;
</script>

<div
	class={cn(
		"no-visible-scrollbar relative flex w-full max-w-full flex-row items-center justify-start overflow-auto [perspective:1000px] sm:overflow-visible",
		containerClassName
	)}>
	{#each propTabs as tab, idx (tab.title)}
		<button
			on:click={() => {
				moveSelectedTabToTop(idx);
			}}
			on:mouseenter={() => (hovering = true)}
			on:mouseleave={() => (hovering = false)}
			class={cn("", tabClassName)}
			style="transform-style: preserve-3d;">
			{#if active.value === tab.value}
				<Motion
					let:motion
					layoutId="clickedbutton"
					transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}>
					<div use:motion class={cn("absolute inset-0", activeTabClassName)} />
				</Motion>
				<span class={cn("relative block", activeTabTextClassName)}>
					{tab.title}
				</span>
			{:else}
				<span class="relative block">
					{tab.title}
				</span>
			{/if}
		</button>
	{/each}
</div>
<FadeInDiv {tabs} {hovering} className={cn("", contentClassName)} />
