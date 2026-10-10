import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { Suggestion } from '../data/suggestions';

export const CHANNEL_ID = 'soovitused';

/** Mitu soovitusteavitust ette ajastatakse (iOS lubab kokku kuni 64). */
export const SCHEDULE_AHEAD = 20;

export type NotificationData =
  | { kind: 'suggestion'; suggestionId: string }
  | { kind: 'plan'; planId: string };

export function configureNotifications(): void {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  if (Platform.OS === 'android') {
    void Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: 'Soovitused ja meeldetuletused',
      importance: Notifications.AndroidImportance.HIGH,
    });
  }
}

export async function ensureNotificationPermission(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  if (!current.canAskAgain) return false;
  const asked = await Notifications.requestPermissionsAsync();
  return asked.granted;
}

async function cancelByKind(kind: NotificationData['kind']): Promise<void> {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  await Promise.all(
    scheduled
      .filter((n) => (n.content.data as Partial<NotificationData> | undefined)?.kind === kind)
      .map((n) => Notifications.cancelScheduledNotificationAsync(n.identifier)),
  );
}

export type ScheduledSuggestion = { date: string; suggestionId: string };

/** Tühistab vanad soovitusteavitused ja ajastab uued. */
export async function scheduleSuggestions(
  items: { date: Date; suggestion: Suggestion }[],
  partnerName: string,
): Promise<ScheduledSuggestion[]> {
  await cancelByKind('suggestion');
  const who = partnerName.trim() || 'kaaslast';
  for (const { date, suggestion } of items) {
    const data: NotificationData = { kind: 'suggestion', suggestionId: suggestion.id };
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `💡 ${suggestion.title}`,
        body: `${suggestion.description} Rõõmusta täna ${who}!`,
        data,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date,
        channelId: CHANNEL_ID,
      },
    });
  }
  return items.map(({ date, suggestion }) => ({
    date: date.toISOString(),
    suggestionId: suggestion.id,
  }));
}

export async function cancelSuggestions(): Promise<void> {
  await cancelByKind('suggestion');
}

export async function schedulePlanReminder(
  planId: string,
  title: string,
  planDate: Date,
  remindAt: Date,
): Promise<string> {
  const data: NotificationData = { kind: 'plan', planId };
  const pad = (n: number) => String(n).padStart(2, '0');
  return Notifications.scheduleNotificationAsync({
    content: {
      title: `⏰ Meeldetuletus: ${title}`,
      body: `Plaanitud ${pad(planDate.getDate())}.${pad(planDate.getMonth() + 1)} kell ${pad(planDate.getHours())}:${pad(planDate.getMinutes())}. Kas kõik on valmis?`,
      data,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: remindAt,
      channelId: CHANNEL_ID,
    },
  });
}

export async function cancelNotification(id: string): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(id);
  } catch {
    // Teavitus võis olla juba saadetud.
  }
}

/** Saadab mõne sekundi pärast proovisoovituse, et kasutaja näeks, kuidas teavitus välja näeb. */
export async function sendTestSuggestion(suggestion: Suggestion): Promise<boolean> {
  if (!(await ensureNotificationPermission())) return false;
  const data: NotificationData = { kind: 'suggestion', suggestionId: suggestion.id };
  await Notifications.scheduleNotificationAsync({
    content: { title: `💡 ${suggestion.title}`, body: suggestion.description, data },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 5,
      channelId: CHANNEL_ID,
    },
  });
  return true;
}
