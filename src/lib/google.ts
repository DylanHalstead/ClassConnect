import type { OAuth2Client } from 'google-auth-library';
import { randomUUID } from 'crypto';

export async function createOfficeHourAppointment(auth: OAuth2Client, title: string, start: Date, end: Date, recepientEmails: string[]): Promise<Error | undefined> {
  const payload = {
    calendarId: 'primary',
    attendees: recepientEmails.map(email => ({ email })),
    start: { dateTime: start.toISOString(), timeZone: 'America/New_York' },
    end: { dateTime: end.toISOString(), timeZone: 'America/New_York' },
    kind: 'calendar#event',
    summary: title,
    conferenceData: {
      createRequest: {
          requestId: randomUUID(),
          conferenceSolutionKey: {type:"hangoutsMeet"}
        }
    },
    reminders: {
      useDefault: false,
      overrides: [
        {'method': 'email', 'minutes': 60},
        {'method': 'popup', 'minutes': 5},
      ],
    },
  }

	const res = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${auth.credentials.access_token}`
		},
		body: JSON.stringify(payload)
	});

	if (!res.ok) {
		return new Error(`Failed to create calendar event: ${res.statusText}, ${await res.text()}`);
	}

	console.log(res);
  return;
}