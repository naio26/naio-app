// The single door to all app data. Today it reads mock data; later each function
// can call Supabase instead, and no screen needs to change.
import { AREAS } from './catalog';
import { people } from './mock/people';
import { plans } from './mock/plans';
import { autoReplies, joinedAtStart, messages, notices, pastPlans, requests } from './mock/social';
import { nowHHMM } from './time';
import {
  Account,
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

/** Pretend network latency so loading states are visible. */
const wait = (ms = 600) => new Promise((resolve) => setTimeout(resolve, ms));

// ---- Auth (fake) ----

export const mockAppleAccount = {
  name: 'Alicia Morató',
  privateEmail: 'alicia@privaterelay.appleid.com',
  email: 'morato.alicia@gmail.com',
};

export const mockGoogleAccount = {
  name: 'Alicia Morató',
  email: 'morato.alicia@gmail.com',
};

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
// A changeable copy of the mock data, so creating, editing, accepting and chatting really change things
// while the app is open. Reloading the app starts again from the mock files.
const clone = <T>(x: T): T => JSON.parse(JSON.stringify(x));
const db = {
  plans: clone(plans),
  requests: clone(requests),
  messages: clone(messages),
  notices: clone(notices),
  blocked: [] as string[],
};
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

const toKm = (a: { latitude: number; longitude: number }, b: { latitude: number; longitude: number }) => {
  const dx = (a.longitude - b.longitude) * 88; // km per degree at Athens' latitude
  const dy = (a.latitude - b.latitude) * 111;
  return Math.round(Math.sqrt(dx * dx + dy * dy) * 10) / 10;
};
const ME = { latitude: 37.9755, longitude: 23.7348 }; // approximate, Syntagma

function applyDraft(plan: Plan, d: PlanDraft): Plan {
  const area = AREAS.find((a) => a.name === d.area) ?? AREAS[0];
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
    language: d.language,
    capacity: d.spots + 1,
    moods: d.moods,
    location: area.location,
    distanceKm: Math.max(0.2, toKm(area.location, ME)),
  };
}

/** "Post plan": only today or tomorrow, you are the host. */
export async function createPlan(d: PlanDraft): Promise<Plan> {
  await wait(700);
  const plan = applyDraft(
    {
      id: newId('plan'),
      hostId: 'me',
      memberIds: ['me'],
    } as Plan,
    d,
  );
  db.plans.push(plan);
  return clone(plan);
}

export async function updatePlan(id: string, d: PlanDraft): Promise<Plan> {
  await wait(600);
  const i = db.plans.findIndex((p) => p.id === id);
  db.plans[i] = applyDraft(db.plans[i], d);
  return clone(db.plans[i]);
}

/** Everyone who joined is told; the chat and exact point go away. */
export async function cancelPlan(id: string): Promise<Plan> {
  await wait(600);
  const plan = db.plans.find((p) => p.id === id)!;
  plan.cancelled = true;
  db.requests = db.requests.filter((r) => r.planId !== id);
  db.messages = db.messages.filter((m) => m.planId !== id);
  return clone(plan);
}

// ---- Joining someone else's plan (fake) ----

/** "Join plan": sends a request to the host. Nothing is shared until they accept. */
export async function requestToJoin(planId: string): Promise<{ planId: string; status: 'requested' }> {
  await wait(500);
  return { planId, status: 'requested' };
}

/** Demo only: the host "accepts" a few seconds after the request. */
export async function waitForHostReply(planId: string): Promise<{ planId: string; status: 'accepted' }> {
  await wait(5000);
  return { planId, status: 'accepted' };
}

export async function cancelJoinRequest(planId: string): Promise<{ planId: string; status: 'none' }> {
  await wait(300);
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
  return clone(r);
}

/** Host only (screen 36): removes someone from your plan. They lose the chat and the exact point. */
export async function removeFromPlan(planId: string, personId: string): Promise<Plan> {
  await wait(400);
  const plan = db.plans.find((p) => p.id === planId)!;
  plan.memberIds = plan.memberIds.filter((m) => m !== personId);
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
  return clone(msg);
}

/** Demo only: someone in the group answers a couple of seconds later. */
export async function waitForReply(planId: string, fromIds: string[]): Promise<Message | null> {
  await wait(2500);
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
  return clone(msg);
}

/** A line in a chat like "You joined the plan". */
export async function addSystemMessage(planId: string, text: string): Promise<Message> {
  const msg: Message = { id: newId('msg'), planId, authorId: 'system', text, time: nowHHMM() };
  db.messages.push(msg);
  return clone(msg);
}

// ---- Alerts (39) ----

export async function listNotices(): Promise<Notice[]> {
  await wait(150);
  return clone(db.notices);
}

export async function addNotice(n: Omit<Notice, 'id' | 'read' | 'minutesAgo'>): Promise<Notice> {
  const notice: Notice = { ...n, id: newId('notice'), read: false, minutesAgo: 0 };
  db.notices.unshift(notice);
  return clone(notice);
}

export async function markNoticeRead(id: string): Promise<void> {
  const n = db.notices.find((x) => x.id === id);
  if (n) n.read = true;
}

// ---- Safety (43–44) ----

export async function blockPerson(id: string): Promise<string[]> {
  await wait(300);
  if (!db.blocked.includes(id)) db.blocked.push(id);
  return [...db.blocked];
}

export async function unblockPerson(id: string): Promise<string[]> {
  await wait(300);
  db.blocked = db.blocked.filter((b) => b !== id);
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
