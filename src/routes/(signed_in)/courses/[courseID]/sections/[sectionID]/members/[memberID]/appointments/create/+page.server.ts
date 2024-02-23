import type { Actions } from './$types';
import { Interval, WeekDay, AppointmentBlock, SectionMember } from '../../../../../../../../../../lib/types';
import { getSectionsSectionMembers, getUsersSectionMembers } from '../../../../../../../../../../lib/db/sectionMembers';
import { getMembersAppointmentBlocks, createAppointmentBlock } from '../../../../../../../../../../lib/db/appointmentBlocks';
import { intervalToDate } from '../../../../../../../../../../lib/utils';
import { isSignedIn } from 'svelte-google-auth/server';
import { redirect, error } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({ locals, request, params, cookies }) => {
    // Validate user is logged in
    const userID: string | undefined = cookies.get('userID');
    if (!isSignedIn(locals) || !userID) {
      error(401,{ message: 'Unauthorized: not logged in' })
    }
    // Validate user owns the memberID
    const usersMembers: SectionMember[] = await getUsersSectionMembers(userID);
    const member = usersMembers.find(member => member.id === params.memberID);
    if (!member || (member.member_type !== 'ta' && member.member_type !== 'instructor')) {
      error(403,{ message: 'Forbidden: Not a part of the instructional team' })
    }
    // Validate the input
    // const data: FormData = await request.formData();
    const data = await request.formData();
    const dayOfWeek = data.get('day-of-week');
    const startTime = data.get('start-time');
    const endTime = data.get('end-time');
    if (!dayOfWeek || !startTime || !endTime ) {
      error(400,{ message: 'Invalid input: missing input' })
    }

    if (!Object.values(WeekDay).includes(dayOfWeek)) {
      error(400,{ message: 'Invalid input: Invalid day of week' })
    }

    // convert the start-time and end-time to Date objects
    const start = new Date(0);
    const splitStart = startTime.split(':');
    start.setHours(splitStart[0]);
    start.setMinutes(splitStart[1]);
    const end = new Date(0);
    const splitEnd = endTime.split(':');
    end.setHours(splitEnd[0]);
    end.setMinutes(splitEnd[1]);
    // validate that the start-time is before the end-time
    if (start >= end) {
      error(400,{ message: 'Invalid input: Start time must be before end' })
    }
    // Calculate duraton throught he difference between the start and end times
    const duration = (end.getTime() - start.getTime()) / 1000 / 60;
    const durationInterval: Interval = {
      hours: Math.floor(duration / 60),
      minutes: duration % 60
    }
    // Validate that the start-time and end-time aren't conflicting with existing appointment blocks
    const membersBlocks: AppointmentBlock[] = await getMembersAppointmentBlocks(params.memberID);
    membersBlocks.forEach(block => {
      if (block.week_day === dayOfWeek) {
        const blockStart = block.start_time;
        const blockEnd = intervalToDate(block.duration);
        // check if new block conflicts with existing blocks
        if (start.getTime() <= blockStart.getTime() && end.getTime() >= blockEnd.getTime()) {
          error(400,{ message: 'Invalid input: Start time conflicts with existing block' })
        }
      }
    });
    const newBlock = await createAppointmentBlock(params.memberID, dayOfWeek, start, durationInterval);
    // redirect to the courses page
    redirect(303, `/courses/${params.courseID}/sections/${params.sectionID}`);
	}
};