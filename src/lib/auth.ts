import { getUsersSectionMembers } from "$lib/db/sectionMembers";
import { SectionMemberType } from "$lib/types";
import { type Cookies, error } from "@sveltejs/kit";
import { isSignedIn } from "svelte-google-auth/server";
import { setFlash } from "sveltekit-flash-message/server";

const unauthenticatedErrorMessage = "You must be signed in to view this page.";

export function getUserID(cookies: Cookies): string {
	const result = cookies.get("userID");

	if (result == undefined) {
		error(401, unauthenticatedErrorMessage);
	}

	return result;
}

export function verifyAuthentication(locals: App.Locals, cookies: Cookies): string | never {
	const userID = cookies.get("userID");
	if (!isSignedIn(locals) || !userID) {
		const errorMessage = unauthenticatedErrorMessage;
		const message = {
			type: "error",
			message: errorMessage
		} as const;

		setFlash(message, cookies);
		error(401, errorMessage);
	}

	return userID;
}

export async function verifyUserIsInSection(
	cookies: Cookies,
	userID: string,
	sectionID: string
): Promise<void> {
	const usersMembers = await getUsersSectionMembers(userID);
	const isUserInThisSection = usersMembers.some(member => member.section_id === sectionID);

	if (!isUserInThisSection) {
		const errorMessage = "You are not a member of this section.";
		const message = {
			type: "error",
			message: errorMessage
		} as const;

		setFlash(message, cookies);
		error(403, errorMessage);
	}
}

export async function verifyUserIsApartOfInstructionalTeam(
	cookies: Cookies,
	userID: string,
	sectionID: string
): Promise<void> {
	const usersMembers = await getUsersSectionMembers(userID);
	const member = usersMembers.find(member => member.section_id === sectionID);

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
}

export async function verifyUserIsMember(
	cookies: Cookies,
	userID: string,
	memberID: string
): Promise<void> {
	const usersMembers = await getUsersSectionMembers(userID);
	const member = usersMembers.find(member => member.id === memberID);

	if (!member) {
		const errorMessage = "You are not related to this member.";
		const message = {
			type: "error",
			message: errorMessage
		} as const;

		setFlash(message, cookies);
		error(403, errorMessage);
	}
}
