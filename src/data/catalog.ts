// Fixed lists the app offers to choose from. Not user data, so they live here and not in mock/.
import { Language, LanguageLevel, Situation } from './types';

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

/** Flags next to languages on the profile (screen 20). Languages without one show no flag. */
export const LANGUAGE_FLAGS: Record<string, string> = {
  ES: '🇪🇸',
  EN: '🇬🇧',
  EL: '🇬🇷',
  FR: '🇫🇷',
  IT: '🇮🇹',
  DE: '🇩🇪',
  PT: '🇵🇹',
  NL: '🇳🇱',
  RU: '🇷🇺',
  UK: '🇺🇦',
  PL: '🇵🇱',
  RO: '🇷🇴',
  TR: '🇹🇷',
  HE: '🇮🇱',
  JA: '🇯🇵',
  KO: '🇰🇷',
  SV: '🇸🇪',
  ZH: '🇨🇳',
  HI: '🇮🇳',
};

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
export const DISTANCES: { label: string; maxKm: number }[] = [
  { label: '< 5 km', maxKm: 5 },
  { label: '5–10 km', maxKm: 10 },
  { label: '10–20 km', maxKm: 20 },
  { label: '20–30 km', maxKm: 30 },
  { label: '> 30 km', maxKm: Infinity },
];

/** All languages with the city's own languages first (e.g. Greek, English in Athens), then the usual order. */
export function languagesFor(cityLanguages: string[]): Language[] {
  const local = cityLanguages.map((c) => LANGUAGES.find((l) => l.code === c)).filter((l): l is Language => !!l);
  return [...local, ...LANGUAGES.filter((l) => !cityLanguages.includes(l.code))];
}

/** Languages offered when creating a plan. */
export const PLAN_LANGUAGES = ['English', 'Spanish', 'Greek', 'French', 'Italian', 'German'];

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
