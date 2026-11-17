import { createContext, useContext } from 'react';

type Boot = {
  /** "Reset demo": clears everything saved on the phone and starts again from the intro. */
  resetDemo: () => Promise<void>;
};

export const BootContext = createContext<Boot | null>(null);

export function useBoot() {
  const ctx = useContext(BootContext);
  if (!ctx) throw new Error('useBoot must be used inside the root layout');
  return ctx;
}
