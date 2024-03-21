import type { LayoutServerLoad } from "./$types";
import { loadFlash, setFlash } from "sveltekit-flash-message/server";
import { error } from "@sveltejs/kit";
import { SectionMember, SectionMemberType } from "$lib/types";

export const load: LayoutServerLoad = loadFlash(async ({ cookies, params, parent }) => {
	const parentVals = await parent();
	const userID: string = parentVals.userID;
	const usersMembers: SectionMember[] = parentVals.usersMembers;
	// Validate user owns the memberID and that they are either a ta or instructor
	const member = usersMembers.find(member => member.id === params.memberID);
	if (
		!member ||
		(member.member_type !== SectionMemberType.TA &&
			member.member_type !== SectionMemberType.Instructor)
	) {
		const errorMessage = "You are not a member of this sections instructional team.";
		const message = {
			type: "error",
			message: errorMessage
		} as const;
		setFlash(message, cookies);
		error(403, errorMessage);
	}
	return { userID };
});