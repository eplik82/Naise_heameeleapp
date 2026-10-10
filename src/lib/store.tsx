import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { ALL_CATEGORIES, Category, SUGGESTIONS, Suggestion } from '../data/suggestions';
import { addCalendarEvent, deleteCalendarEvent } from './calendar';
import { notificationDates, pickSequence, pickSuggestion, planReminderDate } from './logic';
import {
  cancelNotification,
  cancelSuggestions,
  ensureNotificationPermission,
  SCHEDULE_AHEAD,
  ScheduledSuggestion,
  schedulePlanReminder,
  scheduleSuggestions,
} from './notifications';

const STORAGE_KEY = 'heameel:v1';
const HISTORY_MAX = 50;

export type Settings = {
  partnerName: string;
  notificationsEnabled: boolean;
  intervalDays: number;
  hour: number;
  minute: number;
  categories: Category[];
  /** Mitu päeva enne plaani meelde tuletatakse (0 = samal päeval). */
  reminderDaysBefore: number;
  addToCalendarByDefault: boolean;
};

export type Plan = {
  id: string;
  title: string;
  description: string;
  date: string;
  durationMinutes: number;
  suggestionId?: string;
  calendarEventId?: string;
  reminderNotificationId?: string;
  done: boolean;
};

type State = {
  settings: Settings;
  plans: Plan[];
  history: string[];
  currentId?: string;
  schedule: ScheduledSuggestion[];
  /** Kategooriad, mida kasutaja on juba näinud – uued kategooriad lülitatakse sisse. */
  knownCategories: Category[];
};

export const DEFAULT_SETTINGS: Settings = {
  partnerName: '',
  notificationsEnabled: true,
  intervalDays: 3,
  hour: 10,
  minute: 0,
  categories: ALL_CATEGORIES,
  reminderDaysBefore: 1,
  addToCalendarByDefault: true,
};

const INITIAL_STATE: State = {
  settings: DEFAULT_SETTINGS,
  plans: [],
  history: [],
  schedule: [],
  knownCategories: ALL_CATEGORIES,
};

/** Kategooriad, mis olid äpi esimeses versioonis (enne „Kodutööd" lisamist). */
const V1_CATEGORIES: Category[] = ['lilled', 'kultuur', 'valjaskaik', 'kodu', 'kingitus', 'tahelepanu', 'heaolu', 'seiklus'];

export type NewPlan = {
  title: string;
  description: string;
  date: Date;
  durationMinutes: number;
  suggestionId?: string;
  addToCalendar: boolean;
};

type Store = State & {
  loaded: boolean;
  current?: Suggestion;
  updateSettings: (patch: Partial<Settings>) => Promise<void>;
  nextSuggestion: () => void;
  showSuggestion: (id: string) => void;
  addPlan: (plan: NewPlan) => Promise<string[]>;
  togglePlanDone: (id: string) => void;
  deletePlan: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
};

const StoreContext = createContext<Store | null>(null);

function pushHistory(history: string[], id: string): string[] {
  return [...history, id].slice(-HISTORY_MAX);
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(INITIAL_STATE);
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<State>(INITIAL_STATE);

  const commit = useCallback((next: State) => {
    ref.current = next;
    setState(next);
    void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  /**
   * Kannab juba saadetud soovitusteavitused ajalukku (viimane neist on „tänane"
   * soovitus) ja ajastab tulevased teavitused uuesti.
   */
  const doRefresh = useCallback(async () => {
    const now = new Date();
    const s = ref.current;
    const delivered = s.schedule.filter((x) => new Date(x.date) <= now);
    if (delivered.length > 0) {
      let history = s.history;
      for (const d of delivered) history = pushHistory(history, d.suggestionId);
      commit({
        ...s,
        history,
        currentId: delivered[delivered.length - 1].suggestionId,
        schedule: s.schedule.filter((x) => new Date(x.date) > now),
      });
    }

    const { settings, history } = ref.current;
    let schedule: ScheduledSuggestion[] = [];
    if (settings.notificationsEnabled && settings.categories.length > 0 && (await ensureNotificationPermission())) {
      const dates = notificationDates(now, settings.intervalDays, settings.hour, settings.minute, SCHEDULE_AHEAD);
      const picks = pickSequence(SUGGESTIONS, settings.categories, history, dates);
      schedule = await scheduleSuggestions(picks, settings.partnerName);
    } else {
      await cancelSuggestions();
    }
    commit({ ...ref.current, schedule });
  }, [commit]);

  // Ajastamised käivad järjest, et kiired seadete muudatused ei jookseks üksteisest üle.
  const queue = useRef<Promise<void>>(Promise.resolve());
  const refresh = useCallback(() => {
    queue.current = queue.current
      .then(doRefresh)
      .catch((e) => console.warn('Teavituste ajastamine ebaõnnestus', e));
    return queue.current;
  }, [doRefresh]);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const saved = JSON.parse(raw) as Partial<State>;
          const settings = { ...DEFAULT_SETTINGS, ...saved.settings };
          const known = saved.knownCategories ?? V1_CATEGORIES;
          const added = ALL_CATEGORIES.filter((c) => !known.includes(c));
          ref.current = {
            ...INITIAL_STATE,
            ...saved,
            settings: { ...settings, categories: [...settings.categories, ...added] },
            knownCategories: ALL_CATEGORIES,
          };
        }
      } catch {
        // Rikutud andmed – alustame vaikeväärtustega.
      }
      // Uus kasutaja või salvestatud soovitust enam kataloogis pole.
      if (!SUGGESTIONS.some((x) => x.id === ref.current.currentId)) {
        const first = pickSuggestion(SUGGESTIONS, ref.current.settings.categories, ref.current.history);
        if (first) ref.current = { ...ref.current, currentId: first.id, history: pushHistory(ref.current.history, first.id) };
      }
      setState(ref.current);
      setLoaded(true);
      await refresh();
    })();
  }, [refresh]);

  const updateSettings = useCallback(
    async (patch: Partial<Settings>) => {
      commit({ ...ref.current, settings: { ...ref.current.settings, ...patch } });
      await refresh();
    },
    [commit, refresh],
  );

  const nextSuggestion = useCallback(() => {
    const s = ref.current;
    const next = pickSuggestion(SUGGESTIONS, s.settings.categories, s.history);
    if (next) commit({ ...s, currentId: next.id, history: pushHistory(s.history, next.id) });
  }, [commit]);

  const showSuggestion = useCallback(
    (id: string) => {
      const s = ref.current;
      if (s.currentId === id) return;
      commit({ ...s, currentId: id, history: pushHistory(s.history, id) });
    },
    [commit],
  );

  const addPlan = useCallback(
    async (input: NewPlan): Promise<string[]> => {
      const warnings: string[] = [];
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const plan: Plan = {
        id,
        title: input.title,
        description: input.description,
        date: input.date.toISOString(),
        durationMinutes: input.durationMinutes,
        suggestionId: input.suggestionId,
        done: false,
      };

      if (input.addToCalendar) {
        try {
          plan.calendarEventId = await addCalendarEvent({
            title: `💝 ${input.title}`,
            notes: input.description,
            startDate: input.date,
            durationMinutes: input.durationMinutes,
          });
        } catch (e) {
          warnings.push(`Kalendrisse lisamine ebaõnnestus: ${(e as Error).message}`);
        }
      }

      const remindAt = planReminderDate(input.date, ref.current.settings.reminderDaysBefore, new Date());
      try {
        if (remindAt && (await ensureNotificationPermission())) {
          plan.reminderNotificationId = await schedulePlanReminder(id, input.title, input.date, remindAt);
        }
      } catch (e) {
        warnings.push(`Meeldetuletuse ajastamine ebaõnnestus: ${(e as Error).message}`);
      }

      const plans = [...ref.current.plans, plan].sort((a, b) => a.date.localeCompare(b.date));
      commit({ ...ref.current, plans });
      return warnings;
    },
    [commit],
  );

  const togglePlanDone = useCallback(
    (id: string) => {
      const plans = ref.current.plans.map((p) => (p.id === id ? { ...p, done: !p.done } : p));
      commit({ ...ref.current, plans });
    },
    [commit],
  );

  const deletePlan = useCallback(
    async (id: string) => {
      const plan = ref.current.plans.find((p) => p.id === id);
      if (!plan) return;
      if (plan.reminderNotificationId) await cancelNotification(plan.reminderNotificationId);
      if (plan.calendarEventId) await deleteCalendarEvent(plan.calendarEventId);
      commit({ ...ref.current, plans: ref.current.plans.filter((p) => p.id !== id) });
    },
    [commit],
  );

  const current = SUGGESTIONS.find((x) => x.id === state.currentId);

  return (
    <StoreContext.Provider
      value={{
        ...state,
        loaded,
        current,
        updateSettings,
        nextSuggestion,
        showSuggestion,
        addPlan,
        togglePlanDone,
        deletePlan,
        refresh,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore(): Store {
  const store = useContext(StoreContext);
  if (!store) throw new Error('useStore peab olema StoreProvider sees');
  return store;
}
