<script lang="ts">
	import Modal from "$lib/components/modal/Modal.svelte";
	import { type ExtendedSectionMember, SectionMemberType } from "$lib/types";
	import { userName } from "$lib/utils";
	import { createEventDispatcher } from "svelte";

	export let member: ExtendedSectionMember;
	export let isOpen: boolean;

	const dispatch = createEventDispatcher<{ close: undefined }>();

	function confirmRemoval(e: Event) {
		const isConfirmed = confirm("Are you sure you want to remove this member?");
		if (!isConfirmed) {
			e.preventDefault();
		}
	}
</script>

<Modal
	{isOpen}
	on:close={() => {
		dispatch("close");
	}}>
	<div>
		<h2 class="font-bold text-xl">{userName(member.user)}</h2>
		<h3 class="text-sm text-gray-600">ID: {member.id}</h3>
	</div>
	<form
		method="POST"
		action={`/courses/${member.section.course.id}/sections/${member.section.id}?/updateSectionMember`}
		id="member-form">
		<input type="hidden" id="member-id" name="member-id" value={member.id} />
		<div class="flow-root my-5">
			<dl class="-my-3 divide-y divide-gray-400 text-sm">
				<div class="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4 items-center">
					<dt class="font-medium text-gray-900">Email</dt>
					<dd class="text-gray-700 sm:col-span-2">{member.user.email}</dd>
				</div>
				<div class="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4 items-center">
					<label for="section-member-type" class="font-medium text-gray-900">Role</label>
					<dd class="text-gray-700 sm:col-span-2">
						<select
							class="select select-bordered w-full max-w-xs"
							name="section-member-type"
							id="section-member-type"
							required>
							{#each Object.values(SectionMemberType) as sectionMemberType}
								<option
									selected={sectionMemberType === member.member_type}
									value={sectionMemberType}>{sectionMemberType}</option>
							{/each}
						</select>
					</dd>
				</div>
				{#if member.member_type === SectionMemberType.Student}
					<div class="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4 items-center">
						<label for="is-restricted" class="font-medium text-gray-900">Is Restricted</label>
						<dd class="text-gray-700 sm:col-span-2">
							<input
								type="checkbox"
								class="toggle toggle-primary"
								id="is-restricted"
								name="is-restricted"
								checked={member.is_restricted} />
						</dd>
					</div>
				{/if}
			</dl>
		</div>
		<div class="flex justify-between">
			<form
				method="POST"
				action={`/courses/${member.section.course.id}/sections/${member.section.id}?/deleteSectionMember`}
				on:submit={confirmRemoval}>
				<input type="hidden" id="member-id" name="member-id" value={member.id} />
				<button type="submit" class="btn btn-error">Remove</button>
			</form>
			<button type="submit" class="btn btn-primary text-white" form="member-form"
				>Save Changes</button>
		</div>
	</form>
</Modal>
