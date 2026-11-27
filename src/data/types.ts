// The shapes of everything the app talks about. A real backend (Supabase) must return these.

/** The ONLY age ranges allowed anywhere in the app. Exact ages are never stored or shown. */
export const AGE_RANGES = ['18-24', '25-30', '31-39', '40-45', '46-49', '50+'] as const;
export type AgeRange = (typeof AGE_RANGES)[number];

/** Gender options on the profile (09) and in the filters. */
export const GENDERS = ['Male', 'Female', 'Other'] as const;
export type Gender = (typeof GENDERS)[number];

export type LanguageLevel = 'Native' | 'Fluent' | 'Conversational' | 'Learning';

export type Language = {
  code: string; // ISO code, e.g. "EN"
  name: string;
  level?: LanguageLevel;
};

export type Situation = 'I’m a local' | 'New in town' | 'Travelling solo' | 'Staying temporarily';

/** The city the user is in. Only the name is shown in texts. */
export type City = {
  name: string;
  country: string;
  /** Language codes most spoken there, most common first. Shown first in language lists. */
  languages: string[];
  /** Public neighbourhoods offered as the area of a plan ("Create a plan"). */
  areas: CityArea[];
};

export type CityArea = { name: string; location: { latitude: number; longitude: number } };

export type AuthProvider = 'apple' | 'google' | 'email';

/** What sign-in gives us, before the profile is set up. */
export type Account = {
  id: string;
  name: string;
  email: string;
  provider: AuthProvider;
};

export type Person = {
  id: string;
  firstName: string;
  initials: string;
  ageRange: AgeRange;
  gender?: Gender;
  verified: boolean;
  from?: string; // "Valencia, Spain"
  situation?: Situation;
  about?: string;
  interests: string[];
  languages: Language[];
  avatarColor?: string;
  /** Profile photo URL (later). Until then the coloured initial is shown. */
  photo?: string;
  /** Set when the person shows up on the map as "Available" without a plan (screen 28). */
  available?: Availability & {
    stay: string; // "In Athens for 4 days"
    location: { latitude: number; longitude: number }; // approximate
  };
};

/** Plans only ever exist for today or tomorrow. */
export type PlanDay = 'today' | 'tomorrow';

/** A part of the day: Morning (until 12 PM), Afternoon (12–6 PM), Evening (from 6 PM). */
export type DaySlot = 'morning' | 'afternoon' | 'evening';

/**
 * When someone is open to plans: now, and/or any parts of today and tomorrow (several at once).
 * Shown on one line: "Available now · today evening · tomorrow morning & afternoon".
 */
export type Availability = { now: boolean; today: DaySlot[]; tomorrow: DaySlot[] };

export type Plan = {
  id: string;
  title: string;
  tagline: string; // one line on the map sheet
  description: string; // longer text on the details screen
  day: PlanDay;
  time: string; // 24h "HH:mm"
  area: string; // public, approximate: "Lycabettus Hill"
  meetNear: string; // public, approximate: "Lycabettus cable car"
  exactPoint: string; // hidden until the host accepts you
  distanceKm: number;
  languages: string[]; // one or more
  capacity: number; // total people including host, never more than MAX_GROUP (15)
  hostId: string; // 'me' when you host it
  memberIds: string[]; // includes the host
  moods: string[];
  /** How long it lasts, in hours: 1, 2, 3 or 4 (= "4 h+"). Older saved plans have none: 2. */
  durationH?: number;
  location: { latitude: number; longitude: number }; // approximate
  cancelled?: boolean; // cancelled plans vanish from the map; My plans shows them greyed out
  removed?: boolean; // a cancelled plan you swiped away in My plans
};

/** What the current user sees about their own relation to a plan. */
export type JoinStatus = 'none' | 'requested' | 'accepted';

/** One line in a plan's temporary chat. authorId 'system' = "Nora joined the plan". */
export type Message = {
  id: string;
  planId: string;
  authorId: string; // a person id, 'me' or 'system'
  text: string;
  time: string; // 24h "16:08"
};

/** What you fill in on "Create a plan" / "Edit plan" (29, 32). */
export type PlanDraft = {
  title: string;
  day: PlanDay;
  time: string; // 24h "HH:mm"
  duration: number; // hours: 1, 2, 3 or 4 (= "4 h+")
  spots: number; // people who can join, not counting you (max MAX_SPOTS = 14)
  languages: string[]; // one or more
  area: string; // public, e.g. "Monastiraki"
  exactPoint: string; // shared only with people you accept
  note: string;
  moods: string[];
};

/** Someone asking to join one of YOUR plans (39–41). */
export type JoinRequest = {
  id: string;
  planId: string;
  personId: string;
  status: 'pending' | 'accepted' | 'declined';
  minutesAgo: number;
};

/** A line in Alerts (39). Only joins, relevant plans and plan-chat messages: no noise. */
export type Notice = {
  id: string;
  kind: 'join-request' | 'message' | 'match' | 'accepted' | 'cancelled' | 'left';
  title: string;
  subtitle: string;
  minutesAgo: number;
  read: boolean;
  personId?: string;
  planId?: string;
  requestId?: string;
};

/** A plan that already happened (My plans → Past). Information only, the chat is gone. */
export type PastPlan = {
  id: string;
  title: string;
  area: string;
  when: string; // "Yesterday"
  people: string[]; // first names
};

// ---- Your own profile (Phase 2 setup) ----

export const DOC_TYPES = ['National ID', 'Passport', 'Driving licence'] as const;
export type DocType = (typeof DOC_TYPES)[number];

/** The profile you build during setup (screens 09–20). Only the age RANGE is ever stored. */
export type MyProfile = {
  photoChecked: boolean; // live face check passed (screen 10)
  firstName: string;
  ageRange?: AgeRange;
  ageVerified: boolean; // ID checked against the range (screens 12–15)
  gender?: Gender;
  languages: Language[];
  interests: string[]; // 3–8
  situation?: Situation;
  from: string; // optional, "Barcelona, Spain"
  about: string; // optional
  /** You're open to plans (you set it from My profile). Undefined = not open to plans. */
  available?: Availability;
};

// ---- Filters (screens 23–24) ----

export type TimeWindow =
  | 'now'
  | 'today-morning'
  | 'today-afternoon'
  | 'today-evening'
  | 'tomorrow-morning'
  | 'tomorrow-afternoon'
  | 'tomorrow-evening';

export type Filters = {
  maxKm: number | null; // one of DISTANCES; null = none chosen (then 20 km applies, see effectiveKm)
  moods: string[]; // empty = any mood
  languages: string[]; // empty = any language
  when: TimeWindow[]; // empty = any time
  genders: Gender[]; // host's gender, empty = anyone
  /** Age ranges of the people you want to make plans with, from–to (both included). null = any age. */
  ages: { from: AgeRange; to: AgeRange } | null;
};
