import type { OAuth2Client } from 'google-auth-library';
import { randomUUID } from 'crypto';
import type { User } from './types';

export async function createOfficeHourAppointment(auth: OAuth2Client, title: string, description: string, start: Date, end: Date, recepients: User[]): Promise<Error | string> {
  const payload = {
    calendarId: 'primary',
    attendees: recepients.map(recepient => ({ email: recepient.email, responseStatus: 'needsAction'})),
    start: { dateTime: start.toISOString(), timeZone: 'America/New_York' },
    end: { dateTime: end.toISOString(), timeZone: 'America/New_York' },
    kind: 'calendar#event',
    summary: title,
    description: description,
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
		return new Error(`Failed to create calendar event: ${await res.text()}`);
	}

  const data = await res.json();
  if (!data || !data.hangoutLink) {
    return new Error('Failed to create calendar event');
  }

  return data.hangoutLink;
}