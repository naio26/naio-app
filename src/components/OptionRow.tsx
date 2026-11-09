import { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Icon, type IconName } from './Icon';
import { colors, fonts, radius } from '@/theme';
import { Txt } from './Txt';

type Props = {
  label: string;
  selected?: boolean;
  onPress: () => void;
  /** Something before the label, e.g. a language code badge. */
  leading?: ReactNode;
  /** Icon when not selected: › for single choice lists, + for multi choice. */
  idleIcon?: 'chevron-right' | 'plus';
};

/** A list row that turns peach with a ✓ when selected (age range 11, languages 16). */
export function OptionRow({ label, selected, onPress, leading, idleIcon = 'chevron-right' }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [styles.row, selected ? styles.on : styles.off, pressed && { opacity: 0.7 }]}
    >
      {leading}
      <Txt style={[styles.label, selected && styles.labelOn]}>{label}</Txt>
      <Icon name={selected ? 'check' : idleIcon} color={selected ? colors.accent : colors.muted} />
    </Pressable>
  );
}

/** Small rounded badge with a language code ("ES"). */
export function CodeBadge({ code, strong }: { code: string; strong?: boolean }) {
  return (
    <View style={[badge.box, strong && badge.strong]}>
      <Txt style={[badge.text, strong && { fontFamily: fonts.sansBold }]}>{code}</Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 20,
  },
  off: { borderBottomWidth: 1, borderBottomColor: colors.border },
  on: { backgroundColor: colors.accentSoft, borderRadius: radius.md, marginBottom: 2 },
  label: { flex: 1, fontFamily: fonts.sans, fontSize: 17, color: colors.dark },
  labelOn: { fontFamily: fonts.sansBold, color: colors.accent },
});

const badge = StyleSheet.create({
  box: {
    minWidth: 36,
    height: 30,
    paddingHorizontal: 6,
    borderRadius: 10,
    backgroundColor: colors.mist,
    alignItems: 'center',
    justifyContent: 'center',
  },
  strong: { backgroundColor: colors.accentSoft, minWidth: 44, height: 44, borderRadius: 12 },
  text: { fontFamily: fonts.sansMedium, fontSize: 12, color: colors.accent, letterSpacing: 0.5 },
});
