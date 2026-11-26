import { useSyncExternalStore } from 'react';
import { colors } from '@/theme';

/**
 * Fill and text colour of everything that marks YOUR plan (map pill, "Your plan" label):
 * light yellow with deeper golden text. Your plan is always yellow, whatever its day.
 */
export function useMineColours() {
  return { bg: colors.mine, fg: colors.mineInk };
}

// TEST ONLY (Settings → Demo): where the place goes on the plan sheet (map), while the owner compares.
// current = under the description after the divider, A = right under the title (like plan details),
// B = below "3/8 going" and the language, just above the people. Not saved: starts on current.
export type SheetPlaceLook = 'current' | 'A' | 'B';
let sheetPlace: SheetPlaceLook = 'current';
const placeListeners = new Set<() => void>();
export function setSheetPlaceLook(l: SheetPlaceLook) {
  sheetPlace = l;
  placeListeners.forEach((f) => f());
}
export function useSheetPlaceLook() {
  return useSyncExternalStore(
    (f) => {
      placeListeners.add(f);
      return () => placeListeners.delete(f);
    },
    () => sheetPlace,
  );
}
