import { ReactNode } from 'react';
import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { colors, fonts, radius } from '@/theme';
import { Txt } from './Txt';

type Props = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: ReactNode;
  size?: 'sm' | 'md';
  style?: StyleProp<ViewStyle>;
};

/** Pill used for interests, moods, languages and filters. Peach + terracotta when selected. */
export function Chip({ label, selected, onPress, icon, size = 'md', style }: Props) {
  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : 'text'}
      accessibilityState={{ selected }}
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        size === 'sm' && styles.sm,
        selected ? styles.on : styles.off,
        pressed && { opacity: 0.8 },
        style,
      ]}
    >
      {icon}
      <Txt
        variant="label"
        color={selected ? colors.accent : colors.muted}
        style={[{ fontFamily: selected ? fonts.sansBold : fonts.sans }, size === 'sm' && { fontSize: 14 }]}
      >
        {label}
      </Txt>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    height: 40,
    borderRadius: radius.pill,
    borderWidth: 1.5,
  },
  sm: { height: 34, paddingHorizontal: 12 },
  on: { backgroundColor: colors.accentSoft, borderColor: colors.accentLine },
  off: { backgroundColor: colors.white, borderColor: colors.border },
});
