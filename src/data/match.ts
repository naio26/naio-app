// Who shows up on the map: plans and people that match YOUR filters (screens 23–24).
import { effectiveKm } from './catalog';
import { availabilityWindows, matchesFilters } from './time';
import { AGE_RANGES, AgeRange, Filters, Gender, Person, Plan } from './types';

type LatLng = { latitude: number; longitude: number };

/** Your approximate position in the demo (the blue dot). Real location comes later. */
export const MY_AREA: LatLng = { latitude: 37.9755, longitude: 23.7348 };

/** Straight-line distance in km. */
export function kmBetween(a: LatLng, b: LatLng) {
  const r = (d: number) => (d * Math.PI) / 180;
  const dLat = r(b.latitude - a.latitude);
  const dLon = r(b.longitude - a.longitude);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(r(a.latitude)) * Math.cos(r(b.latitude)) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
}

/** Is this age range inside the "Age range" filter? */
export function inAges(range: AgeRange | undefined, f: Filters) {
  if (!f.ages) return true;
  if (!range) return false;
  const i = AGE_RANGES.indexOf(range);
  return i >= AGE_RANGES.indexOf(f.ages.from) && i <= AGE_RANGES.indexOf(f.ages.to);
}

/** Green marker: a plan that matches your filters (the host's age range included). */
export function planMatches(plan: Plan, f: Filters, host?: { gender?: Gender; ageRange?: AgeRange }) {
  return matchesFilters(plan, f, host?.gender) && inAges(host?.ageRange, f);
}

/**
 * Orange marker: someone open to plans (no plan of their own) who matches your filters:
 * distance (always), gender, language, age range and "When" (their now / today / tomorrow slots).
 * Moods are about plans, so they don't hide people.
 */
export function personMatches(p: Person, f: Filters) {
  const a = p.available;
  if (!a) return false;
  if (kmBetween(MY_AREA, a.location) > effectiveKm(f.maxKm)) return false;
  if (f.genders.length && !(p.gender && f.genders.includes(p.gender))) return false;
  if (f.languages.length && !p.languages.some((l) => f.languages.includes(l.name))) return false;
  if (!inAges(p.ageRange, f)) return false;
  if (f.when.length && !availabilityWindows(a).some((w) => f.when.includes(w))) return false;
  return true;
}
