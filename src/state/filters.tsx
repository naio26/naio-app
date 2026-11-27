import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { DISTANCES } from '@/data/catalog';
import { Filters } from '@/data/types';
import { KEYS, useSaved } from './storage';

/** kmV 2 = distances saved as the screen 23 boxes (older saves used 1/5/10/20 km, always one chosen). */
export type SavedFilters = { filters: Filters; introSeen: boolean; kmV?: number };

/** No distance chosen: the map then shows what's within 20 km (DEFAULT_KM). */
export const NO_FILTERS: Filters = { maxKm: null, moods: [], languages: [], when: [], genders: [], ages: null };

/** Filters saved by older versions: a distance that isn't one of the boxes (1 km, or the old 20 km default) = none chosen. */
const upgrade = (f: Filters, version2: boolean): Filters => ({
  ...f,
  maxKm: version2 && DISTANCES.some((d) => d.maxKm === f.maxKm) ? f.maxKm : null,
});

type FiltersState = {
  filters: Filters;
  setFilters: (filters: Filters) => void;
  /** The "What are you up to?" card (screen 22) is shown once, the first time the map opens. */
  introSeen: boolean;
  setIntroSeen: (seen: boolean) => void;
};

const FiltersContext = createContext<FiltersState | null>(null);

export function FiltersProvider({ children, initial }: { children: ReactNode; initial?: SavedFilters }) {
  const [filters, setFilters] = useState<Filters>(() => upgrade({ ...NO_FILTERS, ...initial?.filters }, initial?.kmV === 2));
  const [introSeen, setIntroSeen] = useState(initial?.introSeen ?? false);
  const saved = useMemo(() => ({ filters, introSeen, kmV: 2 }), [filters, introSeen]);
  useSaved(KEYS.filters, saved);
  const value = useMemo(() => ({ filters, setFilters, introSeen, setIntroSeen }), [filters, introSeen]);
  return <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>;
}

export function useFilters() {
  const ctx = useContext(FiltersContext);
  if (!ctx) throw new Error('useFilters must be used inside <FiltersProvider>');
  return ctx;
}

/** How many filter groups are active, for the "Filters · 2" button. */
export function countActive(f: Filters) {
  return (
    (f.maxKm !== null ? 1 : 0) +
    (f.moods.length ? 1 : 0) +
    (f.languages.length ? 1 : 0) +
    (f.when.length ? 1 : 0) +
    (f.genders.length ? 1 : 0) +
    (f.ages ? 1 : 0)
  );
}
