import { Pressable, StyleSheet, View } from 'react-native';
import { Icon, type IconName } from './Icon';
import { toMinutes } from '@/data/time';
import { colors, fonts, radius } from '@/theme';
import { Txt } from './Txt';

/** A little drawn "scene" for a plan, by time of day (My plans, 37). */
export function PlanArt({ time, moods = [] }: { time?: string; moods?: string[] }) {
  const m = time ? toMinutes(time) : 19 * 60;
  const scene =
    m < 12 * 60
      ? { sky: '#FBEFD3', band: '#EDB08A', ground: '#A9B58C' }
      : m < 18 * 60
        ? { sky: '#F8DED0', band: '#E09470', ground: '#C9977A' }
        : { sky: '#F6CDA8', band: '#D4744C', ground: '#A86B57' };
  const icon: IconName = moods.some((x) => /coffee/i.test(x))
    ? 'coffee'
    : moods.some((x) => /night|food|drink/i.test(x))
      ? 'moon'
      : 'sun';
  return (
    <View style={styles.art}>
      <View style={[styles.sky, { backgroundColor: scene.sky }]}>
        <Icon name={icon} color={colors.dark} />
      </View>
      <View style={{ height: 22, backgroundColor: scene.band }} />
      <View style={{ flex: 1, backgroundColor: scene.ground }} />
    </View>
  );
}

/** Plan card with art on the left (My plans, 37). */
export function PlanCard({
  eyebrow,
  title,
  line,
  footer,
  time,
  moods,
  onPress,
}: {
  eyebrow: string;
  title: string;
  line: string;
  footer?: React.ReactNode;
  time?: string;
  moods?: string[];
  onPress?: () => void;
}) {
  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.8 }]}
    >
      <PlanArt time={time} moods={moods} />
      <View style={styles.body}>
        <Txt style={styles.eyebrow}>{eyebrow}</Txt>
        <Txt style={styles.title} numberOfLines={2}>
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
  sky: { flex: 1.4, alignItems: 'center', justifyContent: 'center' },
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
