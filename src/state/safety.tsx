import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { blockPerson, listBlocked, unblockPerson } from '@/data/api';
import { KEYS, useSaved } from './storage';

export type LocationMode = 'approximate' | 'hidden-until-joined';
/** The location permission (demo: simulated). naio can't be used without it. */
export type LocationAccess = 'unknown' | 'granted' | 'denied';
export type NotifyPrefs = {
  joins: boolean;
  matches: boolean;
  messages: boolean;
};

type SafetyState = {
  blocked: string[];
  block: (id: string) => Promise<void>;
  unblock: (id: string) => Promise<void>;
  /** "Go offline & hide from map" (43). */
  offline: boolean;
  setOffline: (v: boolean) => void;
  locationMode: LocationMode;
  setLocationMode: (m: LocationMode) => void;
  prefs: NotifyPrefs;
  setPrefs: (p: NotifyPrefs) => void;
  /** Asked on "You're all set" (21). The map and tabs only open when 'granted'. */
  locationAccess: LocationAccess;
  setLocationAccess: (a: LocationAccess) => void;
};

const SafetyContext = createContext<SafetyState | null>(null);

export type SavedSafety = {
  offline: boolean;
  locationMode: LocationMode;
  prefs: NotifyPrefs;
  locationAccess?: LocationAccess;
};

/** Settings and safety choices (43–44). Saved on the phone; blocked people live in api.ts. */
export function SafetyProvider({ children, initial }: { children: ReactNode; initial?: SavedSafety }) {
  const [blocked, setBlocked] = useState<string[]>([]);
  const [offline, setOffline] = useState(initial?.offline ?? false);
  const [locationMode, setLocationMode] = useState<LocationMode>(initial?.locationMode ?? 'approximate');
  const [prefs, setPrefs] = useState<NotifyPrefs>(initial?.prefs ?? { joins: true, matches: true, messages: true });
  const [locationAccess, setLocationAccess] = useState<LocationAccess>(initial?.locationAccess ?? 'unknown');
  const saved = useMemo(
    () => ({ offline, locationMode, prefs, locationAccess }),
    [offline, locationMode, prefs, locationAccess],
  );
  useSaved(KEYS.safety, saved);
  useEffect(() => {
    listBlocked().then(setBlocked);
  }, []);

  const block = useCallback(async (id: string) => setBlocked(await blockPerson(id)), []);
  const unblock = useCallback(async (id: string) => setBlocked(await unblockPerson(id)), []);

  const value = useMemo(
    () => ({
      blocked,
      block,
      unblock,
      offline,
      setOffline,
      locationMode,
      setLocationMode,
      prefs,
      setPrefs,
      locationAccess,
      setLocationAccess,
    }),
    [blocked, block, unblock, offline, locationMode, prefs, locationAccess],
  );
  return <SafetyContext.Provider value={value}>{children}</SafetyContext.Provider>;
}

export function useSafety() {
  const ctx = useContext(SafetyContext);
  if (!ctx) throw new Error('useSafety must be used inside <SafetyProvider>');
  return ctx;
}
