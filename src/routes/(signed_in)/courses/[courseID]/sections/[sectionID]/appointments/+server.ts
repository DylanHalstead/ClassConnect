import { verifyAuthentication } from "$lib/auth";
import { extendAppointmentBlock, getAppointmentBlock } from "$lib/db/appointmentBlocks";
import { createAppointment } from "$lib/db/appointments";
import { getUsersSectionMembersInSection } from "$lib/db/sectionMembers";
import { getUser } from "$lib/db/users";
import { createOfficeHourAppointment } from "$lib/google";
import { AppointmentBlockBooking } from "$lib/types";
import { userName, sectionName } from "$lib/utils";
import type { RequestHandler } from "@sveltejs/kit";
import { getOAuth2Client } from 'svelte-google-auth';
import { fold } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { PathReporter } from "io-ts/lib/PathReporter";

export const POST: RequestHandler = async ({ cookies, locals, request }) => {
	const userID = verifyAuthentication(locals, cookies);
	const maybeBody = AppointmentBlockBooking.decode(await request.json());

	return await pipe(
		maybeBody,
		fold(
			async () =>
				new Response(PathReporter.report(maybeBody).join("\n"), {
					status: 400
				}),

			async body => {
				const appointmentBlock = await getAppointmentBlock(body.appointmentBlockId);

				if (appointmentBlock instanceof Error) {
					return new Response(appointmentBlock.message, {
						status: 404
					});
				}

				const extendedAppointmentBlock = await extendAppointmentBlock(appointmentBlock);

				if (extendedAppointmentBlock instanceof Error) {
					throw extendedAppointmentBlock;
				}

				const sectionMembers = await getUsersSectionMembersInSection(
					userID,
					extendedAppointmentBlock.instructional_member.section.id
				);

				if (sectionMembers[0] == undefined) {
					return new Response("You aren't a member of this appointment block's section.", {
						status: 403
					});
				}

				const user = await getUser(userID)
				if (user == undefined) {
					return new Response("User not found.", {
						status: 404
					});
				}

				const client = getOAuth2Client(locals);
				const title = `${sectionName(extendedAppointmentBlock.instructional_member.section)} appointment with ${userName(extendedAppointmentBlock.instructional_member.user)}`;
				const description = `This is an appointment between ${userName(user)} and ${userName(extendedAppointmentBlock.instructional_member.user)} for ${extendedAppointmentBlock.instructional_member.section.course.course_name} (${sectionName(extendedAppointmentBlock.instructional_member.section)}).`;
				const recepients = [extendedAppointmentBlock.instructional_member.user, user];
				const start = new Date(body.appointmentDate.getTime());
				start.setHours(extendedAppointmentBlock.start_time.getHours());
				start.setMinutes(extendedAppointmentBlock.start_time.getMinutes());
				const end = new Date(start.getTime() + extendedAppointmentBlock.duration)
				
				const appointmentLink = await createOfficeHourAppointment(client, title, description, start, end, recepients);
				if (appointmentLink instanceof Error) {
					return new Response(appointmentLink.message, {
						status: 500
					});
				}

				await createAppointment({
					appointment_day: body.appointmentDate,
					appointment_block: body.appointmentBlockId,
					student_id: sectionMembers[0].id,
					cancelled: false,
					link: appointmentLink
				});

				return new Response();
			}
		)
	);
};
