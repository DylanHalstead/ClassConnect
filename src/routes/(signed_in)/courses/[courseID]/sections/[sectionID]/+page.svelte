<script lang="ts">
  import { invalidateAll } from "$app/navigation";
	import { initialize } from "svelte-google-auth/client";
	import type { PageData } from "./$types.js";
  import { Icon, Cog8Tooth, EllipsisVertical } from "svelte-hero-icons";
  import MemberModal from "$lib/components/modal/MemberModal.svelte";
  import { SectionMemberType, type ExtendedSectionMember } from "$lib/types";
  import { userName, sectionName } from "$lib/utils";

  export let data: PageData;
  initialize(data, invalidateAll);

  let memberModal: MemberModal;
  let modalMember: ExtendedSectionMember = data.sectionMembers[0];

  function openMemberModal(member: ExtendedSectionMember) {
    modalMember = member;
    memberModal.open();
  }

</script>

<div class="m-6">
  
  <div class="flex justify-between items-center mb-12">
    <h1 class="text-4xl font-bold font-kaisei">
      {sectionName(data.section)} | <span class="text-primary">{data.section.course.course_name}</span>
    </h1>
    <button>
      <Icon src={Cog8Tooth} class="h-8 w-8 stroke-gray-800 hover:stroke-primary transition-colors duration-200 ease-out" />
    </button>
  </div>


  <MemberModal bind:this={memberModal} member={modalMember} />
  
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
          const possibleTypes = Object.values(SectionMemberType)
          return possibleTypes.indexOf(a.member_type) - possibleTypes.indexOf(b.member_type)
        }) as member}
        <tr>
          <td class="whitespace-nowrap pl-8 pr-4 py-2 font-medium text-gray-900">{userName(member.user)}</td>
          <td class="whitespace-nowrap px-4 py-2 text-gray-900">{member.user.email}</td>
          <td class="whitespace-nowrap px-4 py-2 text-gray-900">{member.member_type}</td>
          <td class="whitespace-nowrap px-4 py-2 text-gray-900">{member.member_type == SectionMemberType.Student ? (member.is_restricted ? 'Yes' : 'No') : "N/A"}</td>
          <td class="whitespace-nowrap w-8 pr-8 pl-4 py-2">
            <button on:click={() => {openMemberModal(member)}}>
              <Icon src={EllipsisVertical} class="h-8 w-8 stroke-gray-400 hover:stroke-gray-800 transition-colors duration-200 ease-in-out" />
            </button>
          </td>
        </tr>
        {/each}
        
        <!-- <tr>
          <td class="whitespace-nowrap pl-8 pr-4 py-2 font-medium text-gray-900">Dylan Halstead</td>
          <td class="whitespace-nowrap px-4 py-2 text-gray-900">dhalstea@uncc.edu</td>
          <td class="whitespace-nowrap px-4 py-2 text-gray-900">Student</td>
          <td class="whitespace-nowrap px-4 py-2 text-gray-900">No</td>
          <td class="whitespace-nowrap w-8 pr-8 pl-4 py-2">
            <button on:click={memberModal.open}>
              <Icon src={EllipsisVertical} class="h-8 w-8 stroke-gray-400 hover:stroke-gray-800 transition-colors duration-200 ease-in-out" />
            </button>
          </td>
        </tr> -->
      </tbody>
    </table>
  </div>
</div>
