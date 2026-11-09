import { TextStyle } from 'react-native';
import { colors } from './colors';
import { fonts } from './fonts';

export { colors } from './colors';
export { fonts, fontAssets } from './fonts';

export const space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  gutter: 28, // side padding of most screens
} as const;

export const radius = {
  sm: 10,
  md: 16,
  lg: 22,
  button: 22,
  pill: 999,
} as const;

// Text presets. Screens pick one by name through <Txt variant="…">.
export const type = {
  display: { fontFamily: fonts.serif, fontSize: 42, lineHeight: 46, color: colors.dark, letterSpacing: -0.5 },
  h1: { fontFamily: fonts.serif, fontSize: 34, lineHeight: 40, color: colors.dark, letterSpacing: -0.3 },
  h2: { fontFamily: fonts.serif, fontSize: 26, lineHeight: 32, color: colors.dark },
  eyebrow: {
    fontFamily: fonts.sansBold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 2.4,
    textTransform: 'uppercase',
    color: colors.accent,
  },
  label: { fontFamily: fonts.sansBold, fontSize: 15, lineHeight: 20, color: colors.dark },
  /** Uppercase field labels: "FIRST NAME", "ABOUT ME". */
  section: {
    fontFamily: fonts.sansBold,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    color: colors.dark,
  },
  /** Bold questions in the filters: "How far would you go?" */
  question: { fontFamily: fonts.sansBold, fontSize: 19, lineHeight: 26, color: colors.dark },
  body: { fontFamily: fonts.sans, fontSize: 16, lineHeight: 23, color: colors.muted },
  bodyStrong: { fontFamily: fonts.sansBold, fontSize: 16, lineHeight: 22, color: colors.dark },
  small: { fontFamily: fonts.sans, fontSize: 13, lineHeight: 18, color: colors.muted },
  caption: { fontFamily: fonts.sans, fontSize: 12, lineHeight: 16, color: colors.muted },
  button: { fontFamily: fonts.sansBold, fontSize: 18, lineHeight: 22 },
} satisfies Record<string, TextStyle>;

export type TypeVariant = keyof typeof type;

export const shadow = {
  button: {
    shadowColor: colors.accent,
    shadowOpacity: 0.22,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  soft: {
    shadowColor: '#5A3A28',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
} as const;

/** One icon style for the whole app (Lucide, thin outline). */
export const icon = {
  size: 20, // every small icon
  tab: 24, // bottom tabs
  hero: 48, // the big status icon at the top of "You're in", "Plan posted"…
  stroke: 1.5, // same line width at every size
} as const;
