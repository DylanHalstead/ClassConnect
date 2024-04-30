import { getCourses } from "$lib/db/courses";
import { getSections, extendSections } from "$lib/db/sections";
import { getUsers } from "$lib/db/users";
import type {
	ExtendedSectionMember,
	SectionMember,
	PartialSectionMember,
} from "$lib/types";
import { withConnection } from "$lib/db";
import { bulkQuery } from "$lib/utils";
import { randomUUID } from "crypto";
import type { QueryConfig, QueryResult } from "pg";

export async function createSectionMember(
	partialSectionMember: PartialSectionMember
): Promise<SectionMember> {
	return withConnection(async client => {
		const newSectionMember: SectionMember = {
			...partialSectionMember,

			id: randomUUID()
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

export async function updateSectionMember(
	memberID: string,
	partialSectionMember: PartialSectionMember
): Promise<SectionMember | undefined> {
	return withConnection(async client => {
		const query: QueryConfig = {
			text: `
				UPDATE section_members sm
				SET member_type = $1, is_restricted = $2
				WHERE id = $3
				RETURNING sm.id, sm.section_id, sm.user_id, sm.member_type, sm.is_restricted
			`,
			values: [partialSectionMember.member_type, partialSectionMember.is_restricted, memberID]
		};

		const result: QueryResult<SectionMember> = await client.query(query);
		if (result.rows.length === 0) {
			return undefined;
		}
		return result.rows[0];
	});
}

export async function extendSectionMembers(
	sectionMembers: SectionMember[]
): Promise<ExtendedSectionMember[] | Error> {
	const sectionIds = sectionMembers.map(sectionMember => sectionMember.section_id);
	const sections = await getSections(sectionIds);

	if (sections == undefined) {
		return new Error(`Couldn't find sections with the IDs ${sectionIds}`);
	}

	const extendedSections = await extendSections(sections);

	if (extendedSections instanceof Error) {
		return extendedSections;
	}

	const userIds = sectionMembers.map(sectionMember => sectionMember.user_id);
	const users = await getUsers(userIds);

	if (users == undefined) {
		return new Error(`Couldn't find users with the IDs ${userIds}`);
	}

	const result: ExtendedSectionMember[] = [];

	for (const [i, sectionMember] of sectionMembers.entries()) {
		const section = extendedSections[i];

		if (section == undefined) {
			return new Error(`I didn't get back a section with the ID ${sectionMember.section_id}`);
		}

		const user = users[i];

		if (user == undefined) {
			return new Error(`I didn't get back a user with the ID ${sectionMember.user_id}`);
		}

		result.push({
			...sectionMember,

			section,
			user
		});
	}

	return result;
}

export async function getSectionMembers(ids: string[]): Promise<SectionMember[] | undefined> {
	return bulkQuery(ids, () =>
		withConnection(async client => {
			const query: QueryConfig = {
				text: `
SELECT id, section_id, user_id, member_type, is_restricted
FROM section_members
WHERE id = ANY($1)`,

				values: [ids]
			};

			const result: QueryResult<SectionMember> = await client.query(query);

			return result.rows;
		})
	);
}

export async function getSectionsSectionMembers(sectionIds: string[]): Promise<SectionMember[]> {
	if (sectionIds.length == 0) {
		return [];
	}

	return withConnection(async client => {
		const query: QueryConfig = {
			text: `
SELECT id, section_id, user_id, member_type, is_restricted
FROM section_members
WHERE section_id = ANY($1)`,
			values: [sectionIds]
		};

		const result: QueryResult<SectionMember> = await client.query(query);

		return result.rows;
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

export async function getExtendedSectionMembers(
	sectionId: string
): Promise<ExtendedSectionMember[]> {
	const sectionMembers = await getSectionMembers([sectionId]);
	try {
		if (!sectionMembers || sectionMembers.length === 0) {
			throw Error("No section members found");
		}
		const users = await getUsers(sectionMembers.map(sm => sm.user_id));
		if (users.length === 0) {
			throw Error("No users found");
		}
		const section = await getSections([sectionId]);
		if (!section) {
			throw Error("No section found");
		}
		const extendedSection = await extendSections(section);
		if (extendedSection instanceof Error) {
			throw extendedSection;
		}
		if (extendedSection[0] === undefined) {
			throw Error("No extended sections found");
		}
		const course = await getCourses([extendedSection[0].course.id]);
		if (!course) {
			throw Error("No course found");
		}

		return sectionMembers.map(sm => {
			if (extendedSection[0] === undefined) {
				throw Error("No extended sections found");
			}
			const user = users.find(u => u.id === sm.user_id);
			if (!user) {
				throw new Error(`User ${sm.user_id} not found`);
			}
			return {
				...sm,
				user,
				section: extendedSection[0]
			};
		});
	} catch (error) {
		console.error(error);
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
