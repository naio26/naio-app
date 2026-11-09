// Times in the app. The demo runs on a fixed clock so plans always look "upcoming",
// whatever time you test at. Swap demoNow() for the real time once there's a backend.
import { Filters, Plan, PlanDay, TimeWindow } from './types';

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

const dayLabel = (d: PlanDay) => (d === 'today' ? 'Today' : 'Tomorrow');

/** Starting within the next hour (or started less than 30 min ago). */
export function isNow(plan: Plan) {
  const now = demoNow();
  if (plan.day !== now.day) return false;
  const diff = toMinutes(plan.time) - now.minutes;
  return diff >= -30 && diff <= 60;
}

/** "Today · 6:00 PM" */
export const planWhen = (plan: Plan) => `${dayLabel(plan.day)} · ${formatTime(plan.time)}`;

/** Map pin label: "NOW", "TODAY 6 PM", "TOMORROW 10 AM". */
export const pinLabel = (plan: Plan) => (isNow(plan) ? 'Now' : `${dayLabel(plan.day)} ${formatTime(plan.time, true)}`);

function slot(plan: Plan): TimeWindow {
  const m = toMinutes(plan.time);
  const part = m < 12 * 60 ? 'morning' : m < 18 * 60 ? 'afternoon' : 'evening';
  return `${plan.day}-${part}` as TimeWindow;
}

/** Does a plan pass the filters from screens 23–24? Empty groups mean "anything". */
export function matchesFilters(plan: Plan, f: Filters) {
  if (f.maxKm !== null && plan.distanceKm > f.maxKm) return false;
  if (f.moods.length && !plan.moods.some((m) => f.moods.includes(m))) return false;
  if (f.languages.length && !f.languages.includes(plan.language)) return false;
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
