import { useSyncExternalStore } from 'react';
import { colors } from '@/theme';

/**
 * Fill and text colour of everything that marks YOUR plan (map pill, "Your plan" label).
 * The owner chose A: a lighter green with white text.
 */
export function useMineColours() {
  return { bg: colors.mapMine, fg: colors.white };
}

// TEST ONLY (Settings → Demo): how the note at the bottom of an orange person's card looks,
// while the owner compares. A = the same box with a dashed border, B = no box, a small terracotta
// bell in front of the text. Not saved: the app starts on A. Delete the loser once chosen.
export type NoteLook = 'A' | 'B';
let noteLook: NoteLook = 'A';
const noteListeners = new Set<() => void>();
export function setNoteLook(l: NoteLook) {
  noteLook = l;
  noteListeners.forEach((f) => f());
}
export function useNoteLook() {
  return useSyncExternalStore(
    (f) => {
      noteListeners.add(f);
      return () => noteListeners.delete(f);
    },
    () => noteLook,
  );
}
