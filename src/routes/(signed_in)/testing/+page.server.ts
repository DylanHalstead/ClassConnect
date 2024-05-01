import type { PageServerLoad } from './$types.js';
import { isSignedIn, getOAuth2Client } from 'svelte-google-auth/server';
import { createOfficeHourAppointment } from '$lib/google';

export const load: PageServerLoad = async ({ locals }) => {
	if (isSignedIn(locals)) {
		// Get an authenticated oauth2 client
		const client = getOAuth2Client(locals);
		// Fetch calendar events using the client
    const now = new Date();
    const later = new Date();
    later.setHours(later.getHours() + 1);
		const calendarEvent = await createOfficeHourAppointment(client, 'Office Hours', now, later, ['dhalstea@uncc.edu', 'dylanhalstead11@gmail.com']);
    if (calendarEvent instanceof Error) {
      throw calendarEvent;
    }

		return {
			calendarEvent
		};
	}
  return {
    status: 401
  };
};