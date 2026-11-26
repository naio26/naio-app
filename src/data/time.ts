// Times in the app. The demo runs on a fixed clock so plans always look "upcoming",
// whatever time you test at. Swap demoNow() for the real time once there's a backend.
import { Availability, DaySlot, Filters, Gender, Plan, PlanDay, TimeWindow } from './types';

/** Demo clock: today at 4:18 PM. */
export const demoNow = () => ({ day: 'today' as PlanDay, minutes: 16 * 60 + 18 });

export const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

/** "18:00" → "6:00 PM" (the designs use 12-hour times). */
export function formatTime(hhmm: string, short = false) {
  const [h, m] = hhmm.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return short && m === 0 ? `${h12} ${suffix}` : `${h12}:${String(m).padStart(2, '0')} ${suffix}`;
}

/** Starting within the next hour (or started less than 30 min ago). */
export function isNow(plan: Plan) {
  const now = demoNow();
  if (plan.day !== now.day) return false;
  const diff = toMinutes(plan.time) - now.minutes;
  return diff >= -30 && diff <= 60;
}

/**
 * The ONE place that decides a plan's time type: Now, Today or Tomorrow (your own plans too).
 * Map pins, My plans colours and every "Now/Today/Tomorrow · time" line use it, so a plan
 * is never called "Today" in one place and "Now" in another.
 */
export type DayKind = 'now' | 'today' | 'tomorrow';
export function dayKind(plan: Plan): DayKind {
  if (isNow(plan)) return 'now';
  return plan.day === 'today' ? 'today' : 'tomorrow';
}
const kindLabel = { now: 'Now', today: 'Today', tomorrow: 'Tomorrow' } as const;
/** "Now", "Today" or "Tomorrow". */
export const dayKindLabel = (plan: Plan) => kindLabel[dayKind(plan)];

/** "Today · 6:00 PM" ("Now · 4:30 PM" when it starts within the hour). */
export const planWhen = (plan: Plan) => `${dayKindLabel(plan)} · ${formatTime(plan.time)}`;

/** Map pin label: "NOW", "TODAY 6 PM", "TOMORROW 10 AM". */

/** Morning (until 12 PM), afternoon (12–6 PM) or evening (from 6 PM) for a time in minutes. */
export const daySlotAt = (minutes: number): DaySlot =>
  minutes < 12 * 60 ? 'morning' : minutes < 18 * 60 ? 'afternoon' : 'evening';

function slot(plan: Plan): TimeWindow {
  return `${plan.day}-${daySlotAt(toMinutes(plan.time))}` as TimeWindow;
}

/** The "When" windows someone open to plans covers ("now" also counts as the current part of today). */
export function availabilityWindows(a: Availability): TimeWindow[] {
  const now = daySlotAt(demoNow().minutes);
  if (a.when === 'now') return ['now', `today-${now}` as TimeWindow];
  const out = a.slots.map((s) => `${a.when}-${s}` as TimeWindow);
  // Free today in the part of the day it is now: that's "now" too.
  if (a.when === 'today' && a.slots.includes(now)) out.push('now');
  return out;
}

/** Does a plan pass the filters from screens 23–24? Empty groups mean "anything". */
export function matchesFilters(plan: Plan, f: Filters, hostGender?: Gender) {
  // Always a distance: only plans within it show (20 km by default).
  if (plan.distanceKm > f.maxKm) return false;
  if (f.moods.length && !plan.moods.some((m) => f.moods.includes(m))) return false;
  if (f.languages.length && !plan.languages.some((l) => f.languages.includes(l))) return false;
  if (f.genders.length && !(hostGender && f.genders.includes(hostGender))) return false;
  if (f.when.length && !(f.when.includes(slot(plan)) || (f.when.includes('now') && isNow(plan)))) return false;
  return true;
}

/** "Meet in 1h 42m" for the pinned card in a chat. */
export function startsIn(plan: Plan) {
  const now = demoNow();
  const diff = toMinutes(plan.time) - now.minutes + (plan.day === 'tomorrow' ? 24 * 60 : 0);
  if (diff <= 0) return 'Happening now';
  const h = Math.floor(diff / 60);
  const m = diff % 60;
  return `Meet in ${h ? `${h}h ` : ''}${m}m`;
}

/** "2 min ago", "1 h ago", "Just now". */
export const ago = (minutes: number) =>
  minutes < 1 ? 'Just now' : minutes < 60 ? `${minutes} min ago` : `${Math.floor(minutes / 60)} h ago`;

/** The demo clock as "16:18", for stamping new chat messages. */
export const nowHHMM = () => {
  const m = demoNow().minutes;
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
};

/** Start times you can pick when creating a plan: every 30 min, only later today or tomorrow. */
export function timeOptions(day: PlanDay) {
  const out: string[] = [];
  const from = day === 'today' ? Math.ceil((demoNow().minutes + 15) / 30) * 30 : 7 * 60;
  for (let m = from; m <= 23 * 60 + 30; m += 30) {
    out.push(`${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`);
  }
  return out;
}
