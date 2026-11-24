import { colors } from '@/theme';

/**
 * Fill and text colour of everything that marks YOUR plan (map pill, "Your plan" label).
 * The owner chose A: a lighter green with white text.
 */
export function useMineColours() {
  return { bg: colors.mapMine, fg: colors.white };
}
