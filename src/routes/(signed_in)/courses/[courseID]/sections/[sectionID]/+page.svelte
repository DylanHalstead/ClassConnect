<script lang="ts">
	import { invalidateAll } from "$app/navigation";
	import { initialize } from "svelte-google-auth/client";
	import type { PageData } from "./$types.js";
	import { Icon, Cog8Tooth, EllipsisVertical } from "svelte-hero-icons";
	import MemberModal from "$lib/components/modal/MemberModal.svelte";
	import Modal from "$lib/components/modal/Modal.svelte";
	import { SectionMemberType, type ExtendedSectionMember } from "$lib/types";
	import { userName, sectionName } from "$lib/utils";
	import { error } from "@sveltejs/kit";
	import { title } from "$lib/stores";

	
	export let data: PageData;
	initialize(data, invalidateAll);
  title.set(`${data.section.course.course_name}`);
	
	if (!data.sectionMembers[0]) {
		error(400, "Must have section members to view this page.");
	}
	let modalMember = data.sectionMembers[0];
	let isMemberModalOpen = false;

	let isSettingsModalOpen = false;
	modalMember = data.sectionMembers[0];

	function openMemberModal(member: ExtendedSectionMember) {
		modalMember = member;
		isMemberModalOpen = true;
	}
</script>

<div class="m-6">
	<div class="flex justify-between items-center mb-12">
		<h1 class="text-4xl font-bold font-kaisei">
			{sectionName(data.section)} |
			<span class="text-primary">{data.section.course.course_name}</span>
		</h1>
		<button on:click={() => (isSettingsModalOpen = true)}>
			<Icon
				src={Cog8Tooth}
				class="h-8 w-8 stroke-gray-800 hover:stroke-primary hover:rotate-45 transition-all duration-200 ease-out" />
		</button>
	</div>

	<Modal isOpen={isSettingsModalOpen} on:close={() => (isSettingsModalOpen = false)}>
		<div>
			<h2 class="font-bold text-xl mb-1">Settings</h2>
			<h3 class="text-sm text-gray-600">ID: {data.section.id}</h3>
		</div>
		<form method="POST">
			<div class="flow-root my-5">
				<dl class="-my-3 divide-y divide-gray-400 text-sm">
					<div class="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4 items-center">
						<dt class="font-medium text-gray-900">Maximum Daily Bookable Hours</dt>
						<dd class="text-gray-700 sm:col-span-2">
							<input
								type="number"
								min="0"
								step=".25"
								value={data.section.max_daily_bookable_hours}
								class="input input-bordered input-primary w-full max-w-xs" />
						</dd>
					</div>
					<div class="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4 items-center">
						<dt class="font-medium text-gray-900">Section Number</dt>
						<dd class="text-gray-700 sm:col-span-2">
							<input
								type="number"
								min="0"
								value={data.section.section_number}
								class="input input-bordered input-primary w-full max-w-xs" />
						</dd>
					</div>
				</dl>
			</div>
			<div class="flex justify-between">
				<button type="button" class="btn btn-error">Delete</button>
				<button type="submit" class="btn btn-primary text-white">Save Changes</button>
			</div>
		</form>
	</Modal>

	<MemberModal
		member={modalMember}
		isOpen={isMemberModalOpen}
		on:close={() => (isMemberModalOpen = false)} />
	<div class="overflow-x-auto rounded-lg border border-gray-200">
		<table class="min-w-full max-w-sm divide-y-2 divide-gray-200 bg-white text-sm">
			<thead class="text-left">
				<tr>
					<th class="whitespace-nowrap pl-8 pr-4 py-2 font-semibold text-gray-900">Name</th>
					<th class="whitespace-nowrap px-4 py-2 font-semibold text-gray-900">Email</th>
					<th class="whitespace-nowrap px-4 py-2 font-semibold text-gray-900">Role</th>
					<th class="whitespace-nowrap px-4 py-2 font-semibold text-gray-900">Restricted</th>
					<th class="whitespace-nowrap w-8 pr-8 pl-4 font-semibold text-gray-900"></th>
				</tr>
			</thead>

			<tbody class="divide-y divide-gray-200">
				{#each data.sectionMembers.sort((a, b) => {
					const possibleTypes = Object.values(SectionMemberType);
					return possibleTypes.indexOf(b.member_type) - possibleTypes.indexOf(a.member_type);
				}) as member}
					<tr>
						<td class="whitespace-nowrap pl-8 pr-4 py-2 font-medium text-gray-900"
							>{userName(member.user)}</td>
						<td class="whitespace-nowrap px-4 py-2 text-gray-900">{member.user.email}</td>
						<td class="whitespace-nowrap px-4 py-2 text-gray-900">{member.member_type}</td>
						<td class="whitespace-nowrap px-4 py-2 text-gray-900"
							>{member.member_type == SectionMemberType.Student
								? member.is_restricted
									? "Yes"
									: "No"
								: "N/A"}</td>
						<td class="whitespace-nowrap w-8 pr-8 pl-4 py-2">
							<button on:click={() => openMemberModal(member)}>
								<Icon
									src={EllipsisVertical}
									class="h-8 w-8 stroke-gray-400 rounded-full hover:stroke-gray-700 hover:bg-gray-700/20 transition-colors duration-200 ease-in-out" />
							</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
