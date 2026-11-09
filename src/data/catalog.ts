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

export const SITUATIONS: Situation[] = ['Living locally', 'New in town', 'Travelling solo', 'Staying temporarily'];

export const MOODS = [
  'Coffee',
  'Chill',
  'Adventure',
  'Night out',
  'Food & drinks',
  'Museums',
  'Games',
  'Shopping',
  'Discover city/town',
  'Arts & crafts',
  'Movies',
  'Indoors',
  'Deep talk',
  'Music',
  'Sports',
  'Outdoors',
  'Wellness',
];

/** Distance chips. Choosing one includes every closer plan. */
export const DISTANCES: { label: string; maxKm: number }[] = [
  { label: '< 5 km', maxKm: 5 },
  { label: '5–10 km', maxKm: 10 },
  { label: '10–20 km', maxKm: 20 },
  { label: '20–30 km', maxKm: 30 },
  { label: '> 30 km', maxKm: Infinity },
];

/** Plan languages suggested in the filters (Athens). "+ Add" shows the rest. */
export const SUGGESTED_PLAN_LANGUAGES = ['English', 'Spanish', 'Greek'];

/** The city the demo runs in. */
export const CITY = 'Athens';

/** Neighbourhoods you can pick as the public area of a plan (29), with an approximate spot for the map. */
export const AREAS: { name: string; location: { latitude: number; longitude: number } }[] = [
  { name: 'Monastiraki', location: { latitude: 37.9761, longitude: 23.7257 } },
  { name: 'Plaka', location: { latitude: 37.9722, longitude: 23.7296 } },
  { name: 'Syntagma', location: { latitude: 37.9755, longitude: 23.7348 } },
  { name: 'Psyrri', location: { latitude: 37.9779, longitude: 23.7236 } },
  { name: 'Thiseio', location: { latitude: 37.9765, longitude: 23.7185 } },
  { name: 'Koukaki', location: { latitude: 37.9643, longitude: 23.7247 } },
  { name: 'Kolonaki', location: { latitude: 37.9794, longitude: 23.7426 } },
];

/** Languages offered when creating a plan. */
export const PLAN_LANGUAGES = ['English', 'Spanish', 'Greek', 'French', 'Italian', 'German'];

export const MIN_SPOTS = 1;
export const MAX_SPOTS = 10;

export const REPORT_REASONS = [
  'Made me feel unsafe',
  'Fake profile',
  'Inappropriate messages',
  'Didn’t show up',
  'Something else',
];
