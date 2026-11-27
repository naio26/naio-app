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

// TEST ONLY (Settings → Demo): how you pick your times on "Open to plans" (My profile), while the owner compares.
// A = a grid (Now, then Today / Tomorrow × Morning / Afternoon / Evening), B = one row of time chips in order.
// Not saved: starts on A.
export type OpenLook = 'A' | 'B';
let openLook: OpenLook = 'A';
const openListeners = new Set<() => void>();
export function setOpenLook(l: OpenLook) {
  openLook = l;
  openListeners.forEach((f) => f());
}
export function useOpenLook() {
  return useSyncExternalStore(
    (f) => {
      openListeners.add(f);
      return () => openListeners.delete(f);
    },
    () => openLook,
  );
}
