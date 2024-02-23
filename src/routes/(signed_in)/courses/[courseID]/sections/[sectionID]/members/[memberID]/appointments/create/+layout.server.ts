import type { LayoutServerLoad } from './$types';
import { loadFlash, setFlash } from 'sveltekit-flash-message/server';
import { error } from '@sveltejs/kit';
import { getUsersSectionMembers } from '../../../../../../../../../../lib/db/sectionMembers';
import { SectionMember } from '../../../../../../../../../../lib/types';

export const load: LayoutServerLoad = loadFlash(async ({ cookies, params, parent }) => {
  const { userID } = await parent();
  // Validate user owns the memberID and that they are either a ta or instructor
  const usersMembers: SectionMember[] = await getUsersSectionMembers(userID);
  const member = usersMembers.find(member => member.id === params.memberID);
  if (!member || (member.member_type !== 'ta' && member.member_type !== 'instructor')) {
    const errorMessage = 'You are not a member of this sections instructional team.';
    const message = {
      type: 'error',
      message: errorMessage
    } as const;
    setFlash(message, cookies);
    error(403, errorMessage)
  }
  return { userID };
});