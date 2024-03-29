import type { PageServerLoad, Actions } from './$types';
import { getExtendedSectionMembers } from '$lib/db/sectionMembers';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const { sectionID } = params;
  let sectionMembers = await getExtendedSectionMembers(sectionID);
  if (!sectionMembers) {
    error(400, "Must have section members to view this page.");
  }
	return {
		sectionMembers
	};
};

export const actions: Actions = {
  default: async () => {
    // TODO: Implement Change Section Member Role
  }
}
