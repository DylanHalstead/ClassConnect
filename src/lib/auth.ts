import { isSignedIn } from "svelte-google-auth/server";
import { setFlash } from "sveltekit-flash-message/server";
import { Cookies, error } from "@sveltejs/kit";
import { getUsersSectionMembers } from "$lib/db/sectionMembers";
import { SectionMemberType } from "$lib/types";

export function verifyAuthentication(locals: App.Locals, cookies: Cookies): void {
	const userID = cookies.get("userID");
	if (!isSignedIn(locals) || !userID) {
		const errorMessage = "You must be signed in to view this page.";
		const message = {
			type: "error",
			message: errorMessage
		};
		setFlash(message, cookies);
		error(401, errorMessage);
	}
}

export async function verifyUserIsInSection(
	cookies: Cookies,
	userID: string,
	sectionID: string
): Promise<void> {
	const usersMembers = await getUsersSectionMembers(userID);
	if (!usersMembers) {
		const errorMessage = "Failed to get user's section members.";
		const message = {
			type: "error",
			message: errorMessage
		};
		setFlash(message, cookies);
		error(500, errorMessage);
	}
	const isUserInThisSection = usersMembers.some(member => member.section_id === sectionID);
	if (!isUserInThisSection) {
		const errorMessage = "You are not a member of this section.";
		const message = {
			type: "error",
			message: errorMessage
		};
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
	if (!usersMembers) {
		const errorMessage = "Failed to get user's section members.";
		const message = {
			type: "error",
			message: errorMessage
		};
		setFlash(message, cookies);
		error(500, errorMessage);
	}
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
		};
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
	if (!usersMembers) {
		const errorMessage = "Failed to get user's section members.";
		const message = {
			type: "error",
			message: errorMessage
		};
		setFlash(message, cookies);
		error(500, errorMessage);
	}
	const member = usersMembers.find(member => member.id === memberID);
	if (!member) {
		const errorMessage = "You are not related to this member.";
		const message = {
			type: "error",
			message: errorMessage
		};
		setFlash(message, cookies);
		error(403, errorMessage);
	}
}
