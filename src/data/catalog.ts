// Fixed lists the app offers to choose from. Not user data, so they live here and not in mock/.
import { Availability, DaySlot, Gender, Language, LanguageLevel, Situation } from './types';

export const LANGUAGE_LEVELS: LanguageLevel[] = ['Native', 'Fluent', 'Conversational', 'Learning'];

/** The first ten are shown as "Popular near you"; the rest appear when searching. */
export const LANGUAGES: Language[] = [
  { code: 'ES', name: 'Spanish' },
  { code: 'EN', name: 'English' },
  { code: 'CA', name: 'Catalan' },
  { code: 'EL', name: 'Greek' },
  { code: 'FR', name: 'French' },
  { code: 'IT', name: 'Italian' },
  { code: 'DE', name: 'German' },
  { code: 'PT', name: 'Portuguese' },
  { code: 'AR', name: 'Arabic' },
  { code: 'ZH', name: 'Mandarin Chinese' },
  { code: 'NL', name: 'Dutch' },
  { code: 'RU', name: 'Russian' },
  { code: 'UK', name: 'Ukrainian' },
  { code: 'PL', name: 'Polish' },
  { code: 'RO', name: 'Romanian' },
  { code: 'TR', name: 'Turkish' },
  { code: 'HE', name: 'Hebrew' },
  { code: 'HI', name: 'Hindi' },
  { code: 'JA', name: 'Japanese' },
  { code: 'KO', name: 'Korean' },
  { code: 'SV', name: 'Swedish' },
];
export const POPULAR_LANGUAGES = 10;

export const INTERESTS = [
  'Coffee',
  'Sports',
  'Games',
  'Shopping',
  'Adventure',
  'Local events',
  'Photography',
  'Ocean',
  'Reading',
  'Art',
  'Cinema',
  'Cooking',
  'Music',
  'Dancing',
  'Cocktails',
  'Nature',
  'Deep talk',
  'Night out',
];
export const MIN_INTERESTS = 3;
export const MAX_INTERESTS = 8;

export const SITUATIONS: Situation[] = ['I’m a local', 'New in town', 'Travelling solo', 'Staying temporarily'];

// Ordered so the chips fill balanced rows in the filters (Music in the 2nd row, no chip left alone at the end).
export const MOODS = [
  'Coffee',
  'Chill',
  'Adventure',
  'Night out',
  'Food & drinks',
  'Music',
  'Museums',
  'Games',
  'Shopping',
  'Discover city/town',
  'Arts & crafts',
  'Movies',
  'Indoors',
  'Deep talk',
  'Sports',
  'Outdoors',
  'Wellness',
  'Party',
  'Beach',
];

/** Distance chips. Choosing one includes every closer plan. */
/** How long a plan lasts (Create / Edit a plan). 4 means "4 h+". 2 h by default. */
export const DURATIONS: { hours: number; label: string }[] = [
  { hours: 1, label: '1 h' },
  { hours: 2, label: '2 h' },
  { hours: 3, label: '3 h' },
  { hours: 4, label: '4 h+' },
];
export const DEFAULT_DURATION = 2;

/** Any distance ("> 30 km"). A plain number, so it survives being saved on the phone. */
export const ANY_KM = 100000;

/** "How far would you go?" (screen 23). Choosing one includes every closer plan. */
export const DISTANCES: { label: string; maxKm: number }[] = [
  { label: '< 5 km', maxKm: 5 },
  { label: '5–10 km', maxKm: 10 },
  { label: '10–20 km', maxKm: 20 },
  { label: '20–30 km', maxKm: 30 },
  { label: '> 30 km', maxKm: ANY_KM },
];
/** With no distance chosen, the map shows plans and people up to 20 km from you. */
export const DEFAULT_KM = 20;
/** The distance that applies: the one chosen, or 20 km when none is. */
export const effectiveKm = (maxKm: number | null) => maxKm ?? DEFAULT_KM;

/** Parts of the day for "open to plans" (people in orange). */
export const DAY_SLOTS: { key: DaySlot; title: string; sub: string }[] = [
  { key: 'morning', title: 'Morning', sub: 'until 12 PM' },
  { key: 'afternoon', title: 'Afternoon', sub: '12–6 PM' },
  { key: 'evening', title: 'Evening', sub: 'from 6 PM' },
];

/** "morning", "morning & evening", "morning, afternoon & evening" (always in day order). */
function slotList(slots: DaySlot[]) {
  const names = DAY_SLOTS.filter((s) => slots.includes(s.key)).map((s) => s.title.toLowerCase());
  return names.length < 2 ? (names[0] ?? '') : `${names.slice(0, -1).join(', ')} & ${names[names.length - 1]}`;
}

/** Every availability on one line: "Available now · today evening · tomorrow morning & afternoon". */
export function availabilityText(a: Availability) {
  const parts = [
    a.now && 'now',
    a.today.length > 0 && `today ${slotList(a.today)}`,
    a.tomorrow.length > 0 && `tomorrow ${slotList(a.tomorrow)}`,
  ].filter(Boolean);
  return `Available ${parts.join(' · ')}`;
}

/** Is anything chosen at all? */
export const hasAvailability = (a?: Availability) => !!a && (a.now || a.today.length > 0 || a.tomorrow.length > 0);

/** Saved by older versions as { when, slots } (one day only): turned into the new shape. */
export function upgradeAvailability(a: unknown): Availability | undefined {
  if (!a || typeof a !== 'object') return undefined;
  const o = a as { when?: string; slots?: DaySlot[]; now?: boolean; today?: DaySlot[]; tomorrow?: DaySlot[] };
  if (o.when === undefined) return { now: !!o.now, today: o.today ?? [], tomorrow: o.tomorrow ?? [] };
  return {
    now: o.when === 'now',
    today: o.when === 'today' ? (o.slots ?? []) : [],
    tomorrow: o.when === 'tomorrow' ? (o.slots ?? []) : [],
  };
}

/** All languages with the city's own languages first (e.g. Greek, English in Athens), then the usual order. */
export function languagesFor(cityLanguages: string[]): Language[] {
  const local = cityLanguages.map((c) => LANGUAGES.find((l) => l.code === c)).filter((l): l is Language => !!l);
  return [...local, ...LANGUAGES.filter((l) => !cityLanguages.includes(l.code))];
}


export const MIN_SPOTS = 1;
/** A plan holds at most 15 people in total, the host included. */
export const MAX_GROUP = 15;
/** People who can join besides the host. */
export const MAX_SPOTS = MAX_GROUP - 1;

/** A plan's place: its area, or just the city when no area was chosen. With the city: "Psyrri, Athens". */
export const areaText = (area: string, city: string) => area || city;
export const placeText = (area: string, city: string) => (area ? `${area}, ${city}` : city);

/** "English · Greek" */
export const languagesText = (languages: string[]) => languages.join(' · ');

export const REPORT_REASONS = [
  'Made me feel unsafe',
  'Fake profile',
  'Inappropriate messages',
  'Didn’t show up',
  'Something else',
];

/** Pronouns for a person: she/her, he/him/his, or they/them when the gender is Other or not given. */
export function pronouns(gender?: Gender) {
  if (gender === 'Female') return { subject: 'she', subjectWill: 'She’ll', object: 'her', possessive: 'her' };
  if (gender === 'Male') return { subject: 'he', subjectWill: 'He’ll', object: 'him', possessive: 'his' };
  return { subject: 'they', subjectWill: 'They’ll', object: 'them', possessive: 'their' };
}
