import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Plan } from '@/data/types';
import { colors, fonts, planKindColors, radius } from '@/theme';
import { Txt } from './Txt';

/** The colour of a plan's block: by day only, so plans on the same day always match (Today or Tomorrow). */
export function planKindColor(plan: Plan) {
  return plan.day === 'today' ? planKindColors.today : planKindColors.tomorrow;
}

/** Plan card with a plain colour block on the left (My plans, 37). */
export function PlanCard({
  eyebrow,
  title,
  line,
  footer,
  tint,
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
      <View style={[styles.art, compact && { width: 64 }, { backgroundColor: tint }]} />
      <View style={[styles.body, compact && styles.bodyCompact]}>
        <Txt style={styles.eyebrow}>{eyebrow}</Txt>
        <Txt style={[styles.title, compact && styles.titleCompact]} numberOfLines={2}>
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
  art: { width: 104 },
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
