import { getCourse } from "$lib/db/courses";
import { getExtendedSection } from "$lib/db/section";
import { getUsers } from "$lib/db/users";
import type { ExtendedSectionMember, SectionMember, PartialSectionMember, SectionMemberType } from "$lib/types";
import { withConnection } from "./index";
import type { QueryConfig, QueryResult } from "pg";
import { v4 as uuidv4 } from "uuid";

export async function createSectionMember(
	partialSectionMember: PartialSectionMember
): Promise<SectionMember> {
	return withConnection(async client => {
		const newSectionMember: SectionMember = {
			...partialSectionMember,

			id: uuidv4()
		};

		const query: QueryConfig = {
			text: `
				INSERT INTO section_members (id, section_id, user_id, member_type, is_restricted)
				VALUES ($1, $2, $3, $4, $5)
			`,
			values: [
				newSectionMember.id,
				newSectionMember.section_id,
				newSectionMember.user_id,
				newSectionMember.member_type,
				newSectionMember.is_restricted
			]
		};

		await client.query(query);

		return newSectionMember;
	});
}

export async function updateSectionMember(memberID: string, memberType: SectionMemberType, isRestricted: boolean): Promise<SectionMember | undefined> {
	return withConnection(async client => {
		const query: QueryConfig = {
			text: `
				UPDATE section_members sm
				SET member_type = $1, is_restricted = $2
				WHERE id = $3
				RETURNING sm.id, sm.section_id, sm.user_id, sm.member_type, sm.is_restricted
			`,
			values: [memberType, isRestricted, memberID]
		};

		const result: QueryResult<SectionMember> = await client.query(query);
		if (result.rows.length === 0) {
			return undefined;
		}
		return result.rows[0];
	});
}

export async function getUsersSectionMembers(userId: string): Promise<SectionMember[]> {
	return withConnection(async client => {
		const query: QueryConfig = {
			text: `
				SELECT 
					sm.id, 
					sm.section_id, 
					sm.user_id, 
					sm.member_type, 
					sm.is_restricted 
				FROM section_members sm 
				WHERE sm.user_id = $1
			`,
			values: [userId]
		};

		const result: QueryResult<SectionMember> = await client.query(query);

		return result.rows;
	});
}

export async function getSectionMember(memberId: string): Promise<SectionMember | undefined> {
	return withConnection(async client => {
		const query: QueryConfig = {
			text: `
				SELECT 
					sm.id, 
					sm.section_id, 
					sm.user_id, 
					sm.member_type, 
					sm.is_restricted 
				FROM section_members sm 
				WHERE sm.id = $1
			`,
			values: [memberId]
		};

		const result: QueryResult<SectionMember> = await client.query(query);
		if (result.rows.length === 0) {
			return undefined;
		}

		return result.rows[0];
	});

}

export async function getSectionMembers(sectionId: string): Promise<SectionMember[]> {
	return withConnection(async client => {
		const query: QueryConfig = {
			text: `
				SELECT 
					sm.id, 
					sm.section_id, 
					sm.user_id, 
					sm.member_type, 
					sm.is_restricted 
				FROM section_members sm 
				WHERE sm.section_id = $1
			`,
			values: [sectionId]
		};

		const res: QueryResult<SectionMember> = await client.query(query);
		const sectionMembers = res.rows;
		return sectionMembers;
	});
}

export async function getExtendedSectionMembers(
	sectionId: string
): Promise<ExtendedSectionMember[]> {
	const sectionMembers = await getSectionMembers(sectionId);
	if (sectionMembers.length === 0) {
		return [];
	}
	const users = await getUsers(sectionMembers.map(sm => sm.user_id));
	if (users.length === 0) {
		return [];
	}
	const section = await getExtendedSection(sectionId);
	if (!section) {
		return [];
	}
	const course = await getCourse(section.course.id);
	if (!course) {
		return [];
	}

	try {
		return sectionMembers.map(sm => {
			const user = users.find(u => u.id === sm.user_id);
			if (!user) {
				throw new Error(`User ${sm.user_id} not found`);
			}
			return {
				...sm,
				user,
				section
			};
		});
	} catch (error) {
		return [];
	}
}

export async function deleteSectionMember(memberID: string): Promise<boolean> {
	return withConnection(async client => {
		const query: QueryConfig = {
			text: `
				DELETE FROM section_members
				WHERE id = $1
			`,
			values: [memberID]
		};

		try {
			await client.query(query);
			return true;
		} catch (e) {
			return false;
		}
	});
}