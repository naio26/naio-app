import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { colors } from '@/theme';

// TEST ONLY: which colour "Your plan" uses while the owner compares options (Settings → Demo).
// A = lighter green with white text, B = yellow with dark text. Not saved: the app starts on A.
export type MineLook = 'green' | 'yellow';

type LookState = { mineLook: MineLook; setMineLook: (l: MineLook) => void };
const LookContext = createContext<LookState>({ mineLook: 'green', setMineLook: () => {} });

export function LookProvider({ children }: { children: ReactNode }) {
  const [mineLook, setMineLook] = useState<MineLook>('green');
  const value = useMemo(() => ({ mineLook, setMineLook }), [mineLook]);
  return <LookContext.Provider value={value}>{children}</LookContext.Provider>;
}

export const useLook = () => useContext(LookContext);

/** Fill and text colour of everything that marks YOUR plan. */
export function useMineColours() {
  const { mineLook } = useLook();
  return mineLook === 'yellow'
    ? { bg: colors.mapMineYellow, fg: colors.dark }
    : { bg: colors.mapMine, fg: colors.white };
}
