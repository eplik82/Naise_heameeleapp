import { Category, isInSeason, Suggestion } from '../data/suggestions';

export type Frequency = {
  /** Mitme päeva tagant soovitus tuleb. */
  intervalDays: number;
  label: string;
};

export const FREQUENCIES: Frequency[] = [
  { intervalDays: 1, label: 'Iga päev' },
  { intervalDays: 2, label: 'Ülepäeviti' },
  { intervalDays: 3, label: 'Kaks korda nädalas' },
  { intervalDays: 7, label: 'Kord nädalas' },
  { intervalDays: 14, label: 'Kord kahe nädala jooksul' },
];

/** Mitu viimati antud soovitust ei tohi kohe korduda. */
export const RECENT_LIMIT = 12;

/**
 * Valib soovituse lubatud kategooriatest nii, et see sobiks kuupäeva aastaaega
 * (talvel pole piknikku), hiljuti antud soovitused ei korduks ja eelmise
 * soovituse kategooria ei tuleks kohe uuesti.
 */
export function pickSuggestion(
  all: Suggestion[],
  categories: Category[],
  recentIds: string[],
  date: Date = new Date(),
  random: () => number = Math.random,
): Suggestion | undefined {
  const allowed = all.filter((s) => categories.includes(s.category) && isInSeason(s, date));
  if (allowed.length === 0) return undefined;

  // Mida vähem soovitusi on, seda lühem on keelatud ajalugu – muidu ei jääks valikut.
  const recent = recentIds.slice(-Math.min(RECENT_LIMIT, allowed.length - 1));
  let pool = allowed.filter((s) => !recent.includes(s.id));

  const lastCategory = all.find((s) => s.id === recentIds[recentIds.length - 1])?.category;
  const otherCategory = pool.filter((s) => s.category !== lastCategory);
  if (otherCategory.length > 0) pool = otherCategory;

  return pool[Math.floor(random() * pool.length)];
}

/**
 * Valib soovituse igaks kuupäevaks (iga kuupäeva aastaaja järgi), arvestades ka
 * eelmisi valikuid samas järjendis. Kuupäev, millele sobivat soovitust pole, jäetakse vahele.
 */
export function pickSequence(
  all: Suggestion[],
  categories: Category[],
  recentIds: string[],
  dates: Date[],
  random: () => number = Math.random,
): { date: Date; suggestion: Suggestion }[] {
  const history = [...recentIds];
  const result: { date: Date; suggestion: Suggestion }[] = [];
  for (const date of dates) {
    const suggestion = pickSuggestion(all, categories, history, date, random);
    if (!suggestion) continue;
    result.push({ date, suggestion });
    history.push(suggestion.id);
  }
  return result;
}

/**
 * Arvutab järgmiste teavituste ajad: esimene on lähim tulevane kellaaeg
 * hour:minute, järgmised iga intervalDays päeva tagant.
 */
export function notificationDates(
  now: Date,
  intervalDays: number,
  hour: number,
  minute: number,
  count: number,
): Date[] {
  const first = new Date(now);
  first.setHours(hour, minute, 0, 0);
  if (first.getTime() <= now.getTime()) first.setDate(first.getDate() + 1);

  const dates: Date[] = [];
  for (let i = 0; i < count; i++) {
    const d = new Date(first);
    d.setDate(first.getDate() + i * intervalDays);
    dates.push(d);
  }
  return dates;
}

/** Plaani meeldetuletuse aeg: daysBefore päeva enne kell 9.00, aga mitte minevikus. */
export function planReminderDate(planDate: Date, daysBefore: number, now: Date): Date | undefined {
  const d = new Date(planDate);
  d.setDate(d.getDate() - daysBefore);
  d.setHours(9, 0, 0, 0);
  if (d.getTime() >= planDate.getTime()) d.setTime(planDate.getTime() - 60 * 60 * 1000);
  return d.getTime() > now.getTime() ? d : undefined;
}

export function formatDateTime(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
