// The single door to all app data. Today it reads mock data; later each function
// can call Supabase instead, and no screen needs to change.
import { MAX_GROUP } from './catalog';
import { demoCity } from './mock/city';
import { people } from './mock/people';
import { plans } from './mock/plans';
import { autoReplies, joinedAtStart, messages, notices, pastPlans, requests } from './mock/social';
import { nowHHMM } from './time';
import { load, save } from '@/state/storage';
import {
  Account,
  City,
  AgeRange,
  DocType,
  JoinRequest,
  Message,
  MyProfile,
  Notice,
  PastPlan,
  Person,
  Plan,
  PlanDraft,
} from './types';

/** Pretend network latency so loading states are visible. Also waits for the saved data to be read. */
const wait = async (ms = 600) => {
  await ready;
  await new Promise((resolve) => setTimeout(resolve, ms));
};

// ---- Auth (fake) ----

/** The city the user is in (the demo always uses Athens). Later: from the user's real location. */
export function getCurrentCity(): City {
  return demoCity;
}

export const mockAppleAccount = {
  name: 'Alicia Morató',
  privateEmail: 'alicia@privaterelay.appleid.com',
  email: 'morato.alicia@gmail.com',
};

export const mockGoogleAccount = { name: 'Alicia Morató', email: 'morato.alicia@gmail.com' };

export async function signInWithApple(hideEmail: boolean): Promise<Account> {
  await wait();
  return {
    id: 'me',
    name: mockAppleAccount.name,
    email: hideEmail ? mockAppleAccount.privateEmail : mockAppleAccount.email,
    provider: 'apple',
  };
}

export async function signInWithGoogle(): Promise<Account> {
  await wait();
  return { id: 'me', name: mockGoogleAccount.name, email: mockGoogleAccount.email, provider: 'google' };
}

export async function signInWithEmail(email: string): Promise<Account> {
  await wait();
  return { id: 'me', name: '', email: email.trim().toLowerCase(), provider: 'email' };
}

// ---- In-memory "database" (demo) ----
// A changeable copy of the mock data, so creating, editing, accepting and chatting really change things.
// It's also saved on the phone (like a real backend would keep it), so changes survive a reload.
const clone = <T>(x: T): T => JSON.parse(JSON.stringify(x));
const toKm = (a: { latitude: number; longitude: number }, b: { latitude: number; longitude: number }) => {
  const dx = (a.longitude - b.longitude) * 88; // km per degree at Athens' latitude
  const dy = (a.latitude - b.latitude) * 111;
  return Math.round(Math.sqrt(dx * dx + dy * dy) * 10) / 10;
};
const ME = { latitude: 37.9755, longitude: 23.7348 }; // approximate, Syntagma
// A plan's distance always comes from where it is, so the distance filter and "· 1.1 km" agree.
const withDistance = (p: Plan): Plan => ({ ...p, distanceKm: Math.max(0.2, toKm(p.location, ME)) });
const fresh = () => ({
  plans: clone(plans).map(withDistance),
  requests: clone(requests),
  messages: clone(messages),
  notices: clone(notices),
  blocked: [] as string[],
  /** Alerts for OTHER people (e.g. a host told that you left). Not shown in your Alerts; a real backend would push them. */
  hostNotices: [] as { hostId: string; planId: string; text: string }[],
});
let db = fresh();
const ready: Promise<void> = load<ReturnType<typeof fresh>>('db').then((saved) => {
  if (saved) {
    db = { ...fresh(), ...saved };
    // Older saved copies: one "language" per plan, and groups bigger than 15.
    db.plans = db.plans.map((p) => {
      const old = p as Plan & { language?: string };
      return { ...p, languages: p.languages ?? [old.language ?? 'English'], capacity: Math.min(p.capacity, MAX_GROUP) };
    });
    // Demo plans added after this copy was saved (e.g. the three-language plan) show up without "Reset demo".
    const known = new Set(db.plans.map((p) => p.id));
    db.plans.push(...clone(plans).filter((p) => !known.has(p.id)));
    db.plans = db.plans.map(withDistance);
  }
});
const persist = () => save('db', db);
// Bumped by "Reset demo", so replies that were still on their way are dropped.
let generation = 0;

/** "Reset demo": back to the original mock data (the saved copy is cleared separately). */
export function resetDemoData() {
  db = fresh();
  generation += 1;
}

export async function listBlocked(): Promise<string[]> {
  await wait(50);
  return [...db.blocked];
}
let counter = 0;
const newId = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${(counter++).toString(36)}`;

// ---- People & plans ----

export async function getPerson(id: string): Promise<Person | undefined> {
  await wait(150);
  return people.find((p) => p.id === id);
}

/** Every plan that is still on (cancelled ones are left out). */
export async function listPlans(): Promise<Plan[]> {
  await wait(250);
  return clone(db.plans.filter((p) => !p.cancelled));
}

/** Cancelled plans (still shown, with a red border, in My plans until they would have happened). */
export async function listCancelledPlans(): Promise<Plan[]> {
  await wait(100);
  return clone(db.plans.filter((p) => p.cancelled && !p.removed));
}

/** My plans: swipe a cancelled plan away ("Remove"). */
export async function removeCancelledPlan(id: string): Promise<void> {
  await wait(100);
  const plan = db.plans.find((p) => p.id === id);
  if (plan) plan.removed = true;
  persist();
}

/** One plan, even if cancelled (so "Plan cancelled" can still show it). */
export async function getPlan(id: string): Promise<Plan | undefined> {
  await wait(100);
  const plan = db.plans.find((p) => p.id === id);
  return plan && clone(plan);
}

export async function listPeople(ids: string[]): Promise<Person[]> {
  await wait(100);
  return ids.map((id) => people.find((p) => p.id === id)).filter((p): p is Person => !!p);
}

/** Everyone in the demo except you (for "Block someone" and reports). */
export async function listEveryone(): Promise<Person[]> {
  await wait(100);
  return clone(people);
}

/** People who are free right now without a plan (person pins on the map). */
export async function listAvailablePeople(): Promise<Person[]> {
  await wait(200);
  return people.filter((p) => p.available);
}

export async function listPastPlans(): Promise<PastPlan[]> {
  await wait(150);
  return clone(pastPlans);
}

/** Plans you were already in when the demo starts. */
export async function listMyJoinedPlans(): Promise<string[]> {
  await wait(50);
  return [...joinedAtStart];
}

// ---- Your own plans (29–36) ----


function applyDraft(plan: Plan, d: PlanDraft): Plan {
  // The area is optional: without one, the plan sits at your approximate position and shows the city name.
  const area = getCurrentCity().areas.find((a) => a.name === d.area) ?? { name: '', location: ME };
  return {
    ...plan,
    title: d.title.trim(),
    tagline: d.note.trim() || plan.tagline,
    description: d.note.trim(),
    day: d.day,
    time: d.time,
    area: area.name,
    meetNear: area.name,
    exactPoint: d.exactPoint.trim(),
    languages: d.languages,
    capacity: Math.min(d.spots + 1, MAX_GROUP),
    moods: d.moods,
    location: area.location,
    distanceKm: Math.max(0.2, toKm(area.location, ME)),
  };
}

/** "Post plan": only today or tomorrow, you are the host. */
export async function createPlan(d: PlanDraft): Promise<Plan> {
  await wait(700);
  const plan = applyDraft({ id: newId('plan'), hostId: 'me', memberIds: ['me'] } as Plan, d);
  db.plans.push(plan);
  persist();
  return clone(plan);
}

export async function updatePlan(id: string, d: PlanDraft): Promise<Plan> {
  await wait(600);
  const i = db.plans.findIndex((p) => p.id === id);
  db.plans[i] = applyDraft(db.plans[i], d);
  persist();
  return clone(db.plans[i]);
}

/** Everyone who joined is told; the chat and exact point go away. */
export async function cancelPlan(id: string): Promise<Plan> {
  await wait(600);
  const plan = db.plans.find((p) => p.id === id)!;
  plan.cancelled = true;
  db.requests = db.requests.filter((r) => r.planId !== id);
  db.messages = db.messages.filter((m) => m.planId !== id);
  persist();
  return clone(plan);
}

// ---- Joining someone else's plan (fake) ----

/** "Join plan": sends a request to the host. Nothing is shared until accepted. */
export async function requestToJoin(planId: string): Promise<{ planId: string; status: 'requested' }> {
  await wait(500);
  return { planId, status: 'requested' };
}

/** Demo only: the host "accepts" about 15 seconds after the request (Settings → Demo can skip the wait). */
export async function waitForHostReply(planId: string): Promise<{ planId: string; status: 'accepted' } | null> {
  const gen = generation;
  await wait(15000);
  if (gen !== generation) return null; // "Reset demo" happened meanwhile
  return { planId, status: 'accepted' };
}

/** "Cancel request" (before the host answered). The host is told. */
export async function cancelJoinRequest(
  planId: string,
  myName = 'Someone',
): Promise<{ planId: string; status: 'none' }> {
  await wait(300);
  const plan = db.plans.find((p) => p.id === planId);
  if (plan) db.hostNotices.push({ hostId: plan.hostId, planId, text: `${myName} cancelled their request` });
  persist();
  return { planId, status: 'none' };
}

/** "Leave plan" (after being accepted): your spot is free again, you leave the chat and the host is told. */
export async function leavePlan(planId: string, myName = 'Someone'): Promise<{ planId: string; status: 'none' }> {
  await wait(400);
  const plan = db.plans.find((p) => p.id === planId);
  if (plan) {
    plan.memberIds = plan.memberIds.filter((m) => m !== 'me');
    db.messages.push({
      id: newId('msg'),
      planId,
      authorId: 'system',
      text: `${myName} left the plan`,
      time: nowHHMM(),
    });
    db.hostNotices.push({ hostId: plan.hostId, planId, text: `${myName} left the plan` });
  }
  persist();
  return { planId, status: 'none' };
}

// ---- Requests to YOUR plans (39–41) ----

export async function listJoinRequests(): Promise<JoinRequest[]> {
  await wait(150);
  return clone(db.requests);
}

/** Accept or decline. Accepting adds them to the group and opens the chat for them. */
export async function answerJoinRequest(id: string, accept: boolean): Promise<JoinRequest> {
  await wait(500);
  const r = db.requests.find((x) => x.id === id)!;
  r.status = accept ? 'accepted' : 'declined';
  if (accept) {
    const plan = db.plans.find((p) => p.id === r.planId)!;
    if (!plan.memberIds.includes(r.personId)) plan.memberIds.push(r.personId);
    const name = people.find((p) => p.id === r.personId)?.firstName ?? 'Someone';
    db.messages.push({
      id: newId('msg'),
      planId: plan.id,
      authorId: 'system',
      text: `${name} joined the plan`,
      time: nowHHMM(),
    });
  }
  persist();
  return clone(r);
}

/** Host only (screen 36): removes someone from your plan. They lose the chat and the exact point. */
export async function removeFromPlan(planId: string, personId: string): Promise<Plan> {
  await wait(400);
  const plan = db.plans.find((p) => p.id === planId)!;
  plan.memberIds = plan.memberIds.filter((m) => m !== personId);
  persist();
  return clone(plan);
}

// ---- Temporary chat (38) ----

export async function listMessages(planId: string): Promise<Message[]> {
  await wait(150);
  return clone(db.messages.filter((m) => m.planId === planId));
}

export async function sendMessage(planId: string, text: string): Promise<Message> {
  await wait(200);
  const msg: Message = { id: newId('msg'), planId, authorId: 'me', text: text.trim(), time: nowHHMM() };
  db.messages.push(msg);
  persist();
  return clone(msg);
}

/** Demo only: someone in the group answers a couple of seconds later. */
export async function waitForReply(planId: string, fromIds: string[]): Promise<Message | null> {
  const gen = generation;
  await wait(2500);
  if (gen !== generation) return null;
  const others = fromIds.filter((id) => id !== 'me');
  if (!others.length) return null;
  const msg: Message = {
    id: newId('msg'),
    planId,
    authorId: others[Math.floor(Math.random() * others.length)],
    text: autoReplies[Math.floor(Math.random() * autoReplies.length)],
    time: nowHHMM(),
  };
  db.messages.push(msg);
  persist();
  return clone(msg);
}

/** A line in a chat like "You joined the plan". */
export async function addSystemMessage(planId: string, text: string): Promise<Message> {
  await ready;
  const msg: Message = { id: newId('msg'), planId, authorId: 'system', text, time: nowHHMM() };
  db.messages.push(msg);
  persist();
  return clone(msg);
}

// ---- Alerts (39) ----

export async function listNotices(): Promise<Notice[]> {
  await wait(150);
  return clone(db.notices);
}

export async function addNotice(n: Omit<Notice, 'id' | 'read' | 'minutesAgo'>): Promise<Notice> {
  await ready;
  const notice: Notice = { ...n, id: newId('notice'), read: false, minutesAgo: 0 };
  db.notices.unshift(notice);
  persist();
  return clone(notice);
}

export async function markNoticeRead(id: string): Promise<void> {
  await ready;
  const n = db.notices.find((x) => x.id === id);
  if (n) n.read = true;
  persist();
}

// ---- Safety (43–44) ----

export async function blockPerson(id: string): Promise<string[]> {
  await wait(300);
  if (!db.blocked.includes(id)) db.blocked.push(id);
  persist();
  return [...db.blocked];
}

export async function unblockPerson(id: string): Promise<string[]> {
  await wait(300);
  db.blocked = db.blocked.filter((b) => b !== id);
  persist();
  return [...db.blocked];
}

/** Reports are private and reviewed by people (demo: nothing is sent). */
export async function sendReport(r: { personId?: string; planId?: string; reason: string; details: string }) {
  await wait(800);
  return { ok: true as const, ...r };
}

// ---- Your profile (fake checks) ----

/** Screen 10: pretends to check that one live face is in front of the camera. */
export async function checkFace(): Promise<{ ok: true }> {
  await wait(1800);
  return { ok: true };
}

/** Screen 12: pretends to read the date of birth on the ID and confirm the range. */
export async function verifyAgeRange(
  range: AgeRange,
  doc: DocType,
): Promise<{ ok: true; range: AgeRange; doc: DocType }> {
  await wait(1600);
  return { ok: true, range, doc };
}

/** Screens 14/15: pretends to check the ID photo (corners visible, readable, no glare). */
export async function checkIdPhoto(): Promise<{ ok: true }> {
  await wait(900);
  return { ok: true };
}

/** Screen 20: "Create profile". Later this becomes an insert into Supabase. */
export async function saveProfile(profile: MyProfile): Promise<MyProfile> {
  await wait(700);
  return profile;
}
