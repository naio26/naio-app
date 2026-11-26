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

/** How long a plan lasts, in hours (older saved plans: 2). 4 = "4 h+". */
export const durationOf = (plan: Plan) => plan.durationH ?? 2;

/** Start and end as minutes from the start of TODAY (tomorrow's plans add 24 h). */
export function planSpan(plan: Plan) {
  const start = (plan.day === 'tomorrow' ? 24 * 60 : 0) + toMinutes(plan.time);
  return { start, end: start + durationOf(plan) * 60 };
}

/** Happening right now (between its start and its end) or starting within the next hour. */
export function isNow(plan: Plan) {
  const now = demoNow().minutes;
  const { start, end } = planSpan(plan);
  return (start <= now && now < end) || (start > now && start - now <= 60);
}

/** Do two plans happen (partly) at the same time? Uses each plan's own duration. */
export function plansOverlap(a: Plan, b: Plan) {
  const x = planSpan(a);
  const y = planSpan(b);
  return x.start < y.end && y.start < x.end;
}

/** "8:30 – 10:30 PM", "11:00 AM – 1:00 PM"; 4 h+: "from 8:30 PM · 4 h+". */
export function timeRange(plan: Plan) {
  if (durationOf(plan) >= 4) return `from ${formatTime(plan.time)} · 4 h+`;
  const endMin = (toMinutes(plan.time) + durationOf(plan) * 60) % (24 * 60);
  const end = `${String(Math.floor(endMin / 60)).padStart(2, '0')}:${String(endMin % 60).padStart(2, '0')}`;
  const a = formatTime(plan.time);
  const b = formatTime(end);
  const sameHalf = a.slice(-2) === b.slice(-2);
  return `${sameHalf ? a.slice(0, -3) : a} – ${b}`;
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

/** "Today · 6:00 – 8:00 PM" ("Now · 4:30 – 5:30 PM" while it's on or starts within the hour). */
export const planWhen = (plan: Plan) => `${dayKindLabel(plan)} · ${timeRange(plan)}`;

/** Map pin label: "NOW", "TODAY 6 PM", "TOMORROW 10 AM". */

/** Morning (until 12 PM), afternoon (12–6 PM) or evening (from 6 PM) for a time in minutes. */
export const daySlotAt = (minutes: number): DaySlot =>
  minutes < 12 * 60 ? 'morning' : minutes < 18 * 60 ? 'afternoon' : 'evening';

/** Every "When" window a plan covers, from its start to its end (a plan 11 AM – 1 PM is morning AND afternoon). */
function planWindows(plan: Plan): TimeWindow[] {
  const startMin = toMinutes(plan.time);
  const endMin = Math.min(startMin + durationOf(plan) * 60, 24 * 60); // its own day only
  const parts: [DaySlot, number, number][] = [
    ['morning', 0, 12 * 60],
    ['afternoon', 12 * 60, 18 * 60],
    ['evening', 18 * 60, 24 * 60],
  ];
  return parts.filter(([, a, b]) => startMin < b && a < endMin).map(([s]) => `${plan.day}-${s}` as TimeWindow);
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
  if (f.when.length && !(planWindows(plan).some((w) => f.when.includes(w)) || (f.when.includes('now') && isNow(plan)))) return false;
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
