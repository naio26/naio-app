import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { dayKind } from '@/data/time';
import { Plan } from '@/data/types';
import { colors, fonts, planKindColors, planKindInk, radius } from '@/theme';
import { Txt } from './Txt';

/** The colour of a plan's block, by time only: Now, Today or Tomorrow (your own plan too). */
export function planKindColor(plan: Plan) {
  return planKindColors[dayKind(plan)];
}

/** The text colour that goes with it (title and time), a deeper shade of the same colour. */
export function planKindInkColor(plan: Plan) {
  return planKindInk[dayKind(plan)];
}

/** Plan card with a plain colour block on the left (My plans, 37). */
export function PlanCard({
  eyebrow,
  title,
  line,
  footer,
  tint,
  ink,
  faded,
  compact,
  onPress,
  style,
}: {
  eyebrow: string;
  title: string;
  line: string;
  footer?: React.ReactNode;
  /** Colour of the block on the left (`planKindColor`, or `planKindColors.past` / `.cancelled`). */
  tint: string;
  /** Colour of the time and title (`planKindInkColor`); dark when not given. */
  ink?: string;
  /** Greyed out, like a watermark: a cancelled plan that's no longer on. */
  faded?: boolean;
  /** Smaller card (cancelled plans). */
  compact?: boolean;
  onPress?: () => void;
  /** e.g. the soft red border of a cancelled plan. */
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        compact && styles.compact,
        style,
        faded && styles.faded,
        pressed && { opacity: 0.8 },
      ]}
    >
      <View style={[styles.art, compact && { width: 44 }, { backgroundColor: tint }]} />
      <View style={[styles.body, compact && styles.bodyCompact]}>
        {/* Always ONE line ("TOMORROW · 10:00 AM – 1:00 PM"); on a very narrow phone it shrinks a little. */}
        <Txt style={[styles.eyebrow, ink ? { color: ink } : null]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>
          {eyebrow}
        </Txt>
        <Txt style={[styles.title, compact && styles.titleCompact, ink ? { color: ink } : null]} numberOfLines={2}>
          {title}
        </Txt>
        <Txt variant="caption" numberOfLines={2}>
          {line}
        </Txt>
        {footer}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    minHeight: 140,
    borderRadius: radius.lg + 2,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    overflow: 'hidden',
  },
  // Narrow block, so the time line always fits on one line.
  art: { width: 56 },
  compact: { minHeight: 96 },
  bodyCompact: { paddingVertical: 12, gap: 4 },
  titleCompact: { fontSize: 17, lineHeight: 22 },
  faded: { opacity: 0.5 },
  body: { flex: 1, padding: 16, gap: 6, justifyContent: 'center' },
  eyebrow: {
    fontFamily: fonts.sansBold,
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: colors.dark,
  },
  title: { fontFamily: fonts.serif, fontSize: 21, lineHeight: 26, color: colors.dark },
});
