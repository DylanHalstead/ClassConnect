import type { LayoutServerLoad } from './$types';
import { loadFlash, setFlash } from 'sveltekit-flash-message/server';
import { error } from '@sveltejs/kit';
import { getUsersSectionMembers } from '$lib/db/sectionMembers';

export const load: LayoutServerLoad = loadFlash(async ({ cookies, params, parent }) => {
  const { userID } = await parent();
  // if they are not apart of this section, throw 403
  const sectionID = params.sectionID;
  const usersSectionMembers = await getUsersSectionMembers(userID);
  const isUserInThisSection = usersSectionMembers.some(member => member.section_id === sectionID);
  if(!isUserInThisSection){
    const errorMessage = 'You are not a member of this section.';
    const message = {
      type: 'error',
      message: errorMessage
    } as const;
    setFlash(message, cookies);
    error(403, errorMessage)
  }

  return { userID };
});