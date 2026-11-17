// Saves the demo's progress on the phone (AsyncStorage: local, free, works in Expo Go).
// Everything naio stores uses the "naio:" prefix, so "Reset demo" can remove exactly that.
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PREFIX = 'naio:';

export const KEYS = {
  session: 'session', // who signed in
  profile: 'profile', // your profile + whether it was created
  filters: 'filters', // map filters + "What are you up to?" seen
  plans: 'plans', // your join requests / accepted plans
  safety: 'safety', // offline, location and notification settings
  db: 'db', // the demo "database" in api.ts (plans, requests, chats, alerts, blocked people)
} as const;

type Key = (typeof KEYS)[keyof typeof KEYS];

// JSON can't store Infinity (used for the "> 30 km" filter), so it's written as a marker.
const INF = '__infinity__';
const replacer = (_: string, v: unknown) => (v === Infinity ? INF : v);
const reviver = (_: string, v: unknown) => (v === INF ? Infinity : v);

export async function load<T>(key: Key): Promise<T | undefined> {
  try {
    const raw = await AsyncStorage.getItem(PREFIX + key);
    return raw ? (JSON.parse(raw, reviver) as T) : undefined;
  } catch {
    return undefined; // a broken value just means "start fresh"
  }
}

/** Everything saved, read once at start-up. */
export async function loadAll(): Promise<Partial<Record<Key, unknown>>> {
  const keys = Object.values(KEYS);
  const pairs = await AsyncStorage.multiGet(keys.map((k) => PREFIX + k)).catch(() => []);
  const out: Partial<Record<Key, unknown>> = {};
  for (const [fullKey, raw] of pairs) {
    if (!raw) continue;
    try {
      out[fullKey.slice(PREFIX.length) as Key] = JSON.parse(raw, reviver);
    } catch {
      // ignore broken values
    }
  }
  return out;
}

/** Fire-and-forget save. */
export function save(key: Key, value: unknown) {
  AsyncStorage.setItem(PREFIX + key, JSON.stringify(value, replacer)).catch(() => {});
}

/** Removes everything naio saved on this phone. */
export async function clearAll() {
  const all = await AsyncStorage.getAllKeys();
  await AsyncStorage.multiRemove(all.filter((k) => k.startsWith(PREFIX)));
}

/** Saves `value` under `key` every time it changes. */
export function useSaved(key: Key, value: unknown) {
  useEffect(() => {
    save(key, value);
  }, [key, value]);
}
