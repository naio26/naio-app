import { colors } from '@/theme';

/**
 * Fill and text colour of everything that marks YOUR plan (map pill, "Your plan" label):
 * light yellow with deeper golden text. Your plan is always yellow, whatever its day.
 */
export function useMineColours() {
  return { bg: colors.mine, fg: colors.mineInk };
}


