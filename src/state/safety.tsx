import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { blockPerson, unblockPerson } from '@/data/api';

export type LocationMode = 'approximate' | 'hidden-until-joined';
export type NotifyPrefs = { joins: boolean; matches: boolean; messages: boolean };

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
};

const SafetyContext = createContext<SafetyState | null>(null);

/** Settings and safety choices (43–44). In memory only. */
export function SafetyProvider({ children }: { children: ReactNode }) {
  const [blocked, setBlocked] = useState<string[]>([]);
  const [offline, setOffline] = useState(false);
  const [locationMode, setLocationMode] = useState<LocationMode>('approximate');
  const [prefs, setPrefs] = useState<NotifyPrefs>({ joins: true, matches: true, messages: true });

  const block = useCallback(async (id: string) => setBlocked(await blockPerson(id)), []);
  const unblock = useCallback(async (id: string) => setBlocked(await unblockPerson(id)), []);

  const value = useMemo(
    () => ({ blocked, block, unblock, offline, setOffline, locationMode, setLocationMode, prefs, setPrefs }),
    [blocked, block, unblock, offline, locationMode, prefs],
  );
  return <SafetyContext.Provider value={value}>{children}</SafetyContext.Provider>;
}

export function useSafety() {
  const ctx = useContext(SafetyContext);
  if (!ctx) throw new Error('useSafety must be used inside <SafetyProvider>');
  return ctx;
}
