import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { DEFAULT_KM, DISTANCES } from '@/data/catalog';
import { Filters } from '@/data/types';
import { KEYS, useSaved } from './storage';

export type SavedFilters = { filters: Filters; introSeen: boolean };

export const NO_FILTERS: Filters = { maxKm: DEFAULT_KM, moods: [], languages: [], when: [], genders: [], ages: null };

/** Filters saved by older versions: "any distance" (null), 30 km or "> 30 km" become the 20 km default. */
const upgrade = (f: Filters): Filters => ({
  ...f,
  maxKm: DISTANCES.some((d) => d.maxKm === f.maxKm) ? f.maxKm : DEFAULT_KM,
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
  const [filters, setFilters] = useState<Filters>(() => upgrade({ ...NO_FILTERS, ...initial?.filters }));
  const [introSeen, setIntroSeen] = useState(initial?.introSeen ?? false);
  const saved = useMemo(() => ({ filters, introSeen }), [filters, introSeen]);
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
    (f.maxKm !== DEFAULT_KM ? 1 : 0) +
    (f.moods.length ? 1 : 0) +
    (f.languages.length ? 1 : 0) +
    (f.when.length ? 1 : 0) +
    (f.genders.length ? 1 : 0) +
    (f.ages ? 1 : 0)
  );
}
