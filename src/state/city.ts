import { getCurrentCity } from '@/data/api';

/**
 * The city you're in, for texts like "Welcome to Athens." or "Exploring Athens".
 * Always use this (never type a city name in a screen). Today it's the demo city;
 * later it will follow the user's real location.
 */
export function useCity() {
  return getCurrentCity();
}
