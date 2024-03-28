<script lang="ts">
  import { invalidateAll } from "$app/navigation";
	import { initialize } from "svelte-google-auth/client";
	import type { PageData } from "./$types.js";
  import { Icon, Cog8Tooth } from "svelte-hero-icons";
  import MemberModal from "$lib/components/modal/MemberModal.svelte";

  let memberModal: MemberModal;

	export let data: PageData;
	initialize(data, invalidateAll);
</script>

<div class="m-6">
  
  <div class="flex justify-between items-center">
    <h1 class="text-4xl font-bold font-kaisei">
      ITSC 3155-091 | <span class="text-primary">Software Engineering</span>
    </h1>
    <button>
      <Icon src={Cog8Tooth} class="h-8 w-8 stroke-slate-800 hover:stroke-primary transition-colors duration-200 ease-out" />
    </button>
  </div>

  <MemberModal bind:this={memberModal} />
  
  <h2>Insturcitonal Team</h2>
  <div class="overflow-x-auto rounded-lg border border-gray-200">
    <table class="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
      <thead class="text-left">
        <tr>
          <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Name</th>
          <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Date of Birth</th>
          <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Role</th>
          <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Salary</th>
          <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900"></th>
        </tr>
      </thead>
  
      <tbody class="divide-y divide-gray-200">
        <tr>
          <td class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">John Doe</td>
          <td class="whitespace-nowrap px-4 py-2 text-gray-700">24/05/1995</td>
          <td class="whitespace-nowrap px-4 py-2 text-gray-700">Web Developer</td>
          <td class="whitespace-nowrap px-4 py-2 text-gray-700">$120,000</td>
          <td class="whitespace-nowrap px-4 py-2 text-gray-700"><button class="btn btn-primary" on:click={memberModal.open}>Details</button></td>
        </tr>
      </tbody>
    </table>
  </div>
  
  <h2>Students</h2>
  <div class="overflow-x-auto rounded-lg border border-gray-200">
    <table class="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
      <thead class="text-left">
        <tr>
          <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Name</th>
          <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Date of Birth</th>
          <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Role</th>
          <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Salary</th>
          <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900"></th>
        </tr>
      </thead>
  
      <tbody class="divide-y divide-gray-200">
        <tr>
          <td class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">John Doe</td>
          <td class="whitespace-nowrap px-4 py-2 text-gray-700">24/05/1995</td>
          <td class="whitespace-nowrap px-4 py-2 text-gray-700">Web Developer</td>
          <td class="whitespace-nowrap px-4 py-2 text-gray-700">$120,000</td>
          <td class="whitespace-nowrap px-4 py-2 text-gray-700"><button class="btn btn-primary" on:click={memberModal.open}>Details</button></td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
