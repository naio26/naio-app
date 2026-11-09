// The shapes of everything the app talks about. A real backend (Supabase) must return these.

/** The ONLY age ranges allowed anywhere in the app. Exact ages are never stored or shown. */
export const AGE_RANGES = ['18-24', '25-30', '31-39', '40-45', '46-49', '50+'] as const;
export type AgeRange = (typeof AGE_RANGES)[number];

export type LanguageLevel = 'Native' | 'Fluent' | 'Conversational' | 'Learning';

export type Language = {
  code: string; // ISO code, e.g. "EN"
  name: string;
  level?: LanguageLevel;
};

export type Situation = 'Living locally' | 'New in town' | 'Travelling solo' | 'Staying temporarily';

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
  verified: boolean;
  from?: string; // "Valencia, Spain"
  situation?: Situation;
  about?: string;
  interests: string[];
  languages: Language[];
  avatarColor?: string;
  /** Set when the person shows up on the map as "Available" without a plan (screen 28). */
  available?: {
    until: string; // 24h "HH:mm"
    stay: string; // "In Athens for 4 days"
    location: { latitude: number; longitude: number }; // approximate
  };
};

/** Plans only ever exist for today or tomorrow. */
export type PlanDay = 'today' | 'tomorrow';

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
  language: string;
  capacity: number; // total people including host
  hostId: string; // 'me' when you host it
  memberIds: string[]; // includes the host
  moods: string[];
  location: { latitude: number; longitude: number }; // approximate
  cancelled?: boolean; // cancelled plans vanish from the map and lists
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
  spots: number; // people who can join, not counting you
  language: string;
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
  kind: 'join-request' | 'message' | 'match' | 'accepted' | 'cancelled';
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
  languages: Language[];
  interests: string[]; // 3–8
  situation?: Situation;
  from: string; // optional, "Barcelona, Spain"
  about: string; // optional
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
  maxKm: number | null; // null = any distance
  moods: string[]; // empty = any mood
  languages: string[]; // empty = any language
  when: TimeWindow[]; // empty = any time
};
