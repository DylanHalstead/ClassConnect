<script lang="ts">
  import Modal from "$lib/components/modal/Modal.svelte";
  import type { ExtendedSectionMember } from "$lib/types";

  let modal: Modal;
  let member: ExtendedSectionMember;

  export function open() {
    modal.open();
  }

</script>

<Modal bind:this={modal}> 
  <!-- name, email, member_id, is_restricted, member_type -->
  <div>
    <h2 class="font-bold text-xl">Dylan Halstead</h2>
    <h3 class="text-sm text-slate-600">9804ce91-5a8e-425c-bf2a-b563fe185b84</h3>
  </div>
  <div class="flow-root my-5">
    <dl class="-my-3 divide-y divide-gray-400 text-sm">
      <div class="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
        <dt class="font-medium text-gray-900">Email</dt>
        <dd class="text-gray-700 sm:col-span-2">dhalstea@uncc.edu</dd>
      </div>
      <div class="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
        <dt class="font-medium text-gray-900">Role</dt>
        <dd class="text-gray-700 sm:col-span-2">Student</dd>
      </div>
      <div class="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
        <dt class="font-medium text-gray-900">Is Restricted</dt>
        <dd class="text-gray-700 sm:col-span-2">
          <input type="checkbox" class="toggle toggle-primary"/>
        </dd>
      </div>
    </dl>
  </div>  
  <button class="btn btn-error ml-auto">Remove</button>
</Modal>