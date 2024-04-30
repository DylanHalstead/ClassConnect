import { verifyAuthentication } from "$lib/auth";
import { extendAppointmentBlock, getAppointmentBlock } from "$lib/db/appointmentBlocks";
import { createAppointment } from "$lib/db/appointments";
import { getUsersSectionMembersInSection } from "$lib/db/sectionMembers";
import { AppointmentBlockBooking } from "$lib/types";
import type { RequestHandler } from "@sveltejs/kit";
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

				await createAppointment({
					appointment_day: body.appointmentDate,
					appointment_block: body.appointmentBlockId,
					student_id: sectionMembers[0].id,
					cancelled: false,
					link: ""
				});

				return new Response();
			}
		)
	);
};
