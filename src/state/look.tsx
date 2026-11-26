import { useSyncExternalStore } from 'react';
import { colors } from '@/theme';

/**
 * Fill and text colour of everything that marks YOUR plan (map pill, "Your plan" label):
 * light yellow with deeper golden text. Your plan is always yellow, whatever its day.
 */
export function useMineColours() {
  return { bg: colors.mine, fg: colors.mineInk };
}


// TEST ONLY (Settings → Demo): the shape of YOUR plan's marker on the map, while the owner compares.
// A = rounded square with a star (built like the orange people markers) + "Your plan" tag under it,
// B = a classic map pin (teardrop) with a star + "Your plan" tag. Same yellow colours in both.
// Not saved: the app starts on A. Delete the loser once chosen.
export type MinePinLook = 'A' | 'B';
let minePinLook: MinePinLook = 'A';
const pinListeners = new Set<() => void>();
export function setMinePinLook(l: MinePinLook) {
  minePinLook = l;
  pinListeners.forEach((f) => f());
}
export function useMinePinLook() {
  return useSyncExternalStore(
    (f) => {
      pinListeners.add(f);
      return () => pinListeners.delete(f);
    },
    () => minePinLook,
  );
}
