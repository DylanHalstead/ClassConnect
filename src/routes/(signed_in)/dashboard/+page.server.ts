import { getUserID } from "$lib/auth";
import { extendAppointments, getStudentsAppointments } from "$lib/db/appointments";
import { getUsersSectionMembers } from "$lib/db/sectionMembers";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ cookies }) => {
    const userID = getUserID(cookies);
    const usersMembers = await getUsersSectionMembers(userID);

    if (usersMembers == undefined) {
        error(404, "User not found.");
    }
    
    const studentAppointments = await getStudentsAppointments(usersMembers.map(user => user.id));

    const extendedStudentAppointments = await extendAppointments(studentAppointments);
    if (extendedStudentAppointments instanceof Error) {
        throw extendedStudentAppointments;
    }

    extendedStudentAppointments.sort((a, b) => {
        return a.appointment_day.getTime() - b.appointment_day.getTime();
    });

    // const instructionalMemberAppointments = await;
    

    return {
        studentAppointments: extendedStudentAppointments
    };

};