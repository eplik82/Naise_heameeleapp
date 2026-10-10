import { Platform } from 'react-native';
// Expo Go toetab ainult expo-calendar'i „legacy" API-t; uus API töötab vaid omaehitises.
import * as Calendar from 'expo-calendar/legacy';

const APP_CALENDAR_TITLE = 'Heameel';

export class CalendarPermissionError extends Error {
  constructor() {
    super('Kalendri kasutamiseks pole luba antud.');
  }
}

async function ensurePermission(): Promise<void> {
  const current = await Calendar.getCalendarPermissionsAsync();
  if (current.granted) return;
  const asked = await Calendar.requestCalendarPermissionsAsync();
  if (!asked.granted) throw new CalendarPermissionError();
}

async function findWritableCalendarId(): Promise<string> {
  if (Platform.OS === 'ios') {
    const def = await Calendar.getDefaultCalendarAsync();
    return def.id;
  }

  const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
  const writable = calendars.filter(
    (c) =>
      c.allowsModifications &&
      (c.accessLevel === Calendar.CalendarAccessLevel.OWNER ||
        c.accessLevel === Calendar.CalendarAccessLevel.EDITOR ||
        c.accessLevel === Calendar.CalendarAccessLevel.CONTRIBUTOR),
  );
  const chosen =
    writable.find((c) => c.isPrimary) ??
    writable.find((c) => c.title === APP_CALENDAR_TITLE) ??
    writable[0];
  if (chosen) return chosen.id;

  // Telefonis pole ühtegi kirjutatavat kalendrit – loome äpile oma kohaliku kalendri.
  return Calendar.createCalendarAsync({
    title: APP_CALENDAR_TITLE,
    name: APP_CALENDAR_TITLE,
    color: '#E0457B',
    entityType: Calendar.EntityTypes.EVENT,
    source: { isLocalAccount: true, name: APP_CALENDAR_TITLE, type: Calendar.SourceType.LOCAL },
    ownerAccount: 'personal',
    accessLevel: Calendar.CalendarAccessLevel.OWNER,
  });
}

export type CalendarEntry = {
  title: string;
  notes?: string;
  startDate: Date;
  durationMinutes: number;
  /** Mitu minutit enne algust kalender meelde tuletab. */
  alarmMinutesBefore?: number;
};

/** Lisab kirje telefoni kalendrisse ja tagastab kirje ID. */
export async function addCalendarEvent(entry: CalendarEntry): Promise<string> {
  await ensurePermission();
  const calendarId = await findWritableCalendarId();
  const endDate = new Date(entry.startDate.getTime() + entry.durationMinutes * 60 * 1000);
  return Calendar.createEventAsync(calendarId, {
    title: entry.title,
    notes: entry.notes,
    startDate: entry.startDate,
    endDate,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    alarms: [{ relativeOffset: -(entry.alarmMinutesBefore ?? 60) }],
  });
}

export async function deleteCalendarEvent(id: string): Promise<void> {
  try {
    await Calendar.deleteEventAsync(id);
  } catch {
    // Kirje võis olla kalendrist juba käsitsi kustutatud.
  }
}
