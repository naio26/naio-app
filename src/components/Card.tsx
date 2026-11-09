import { ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { colors, radius } from '@/theme';

type Props = {
  children: ReactNode;
  /** white = bordered card, muted = grey info box, soft = highlighted box */
  tone?: 'white' | 'muted' | 'soft';
  style?: StyleProp<ViewStyle>;
};

export function Card({ children, tone = 'white', style }: Props) {
  return <View style={[styles.base, styles[tone], style]}>{children}</View>;
}

const styles = StyleSheet.create({
  base: { borderRadius: radius.lg, padding: 16 },
  white: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border },
  muted: { backgroundColor: colors.mist },
  soft: { backgroundColor: colors.accentSoft },
});
