import { Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { colors, icon } from '@/theme';
import { Icon } from './Icon';

type Props = {
  onPress?: () => void;
  /** Chevron colour, e.g. white on the dark camera screen. */
  color?: string;
};

/** A plain "‹", the same on every screen (no circle). */
export function BackButton({ onPress, color = colors.dark }: Props) {
  const handlePress = onPress ?? (() => router.back());
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Back"
      hitSlop={14}
      onPress={handlePress}
      style={({ pressed }) => [styles.plain, pressed && { opacity: 0.5 }]}
    >
      <Icon name="chevron-left" size={icon.tab} color={color} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  plain: { width: 32, height: 32, justifyContent: 'center', marginLeft: -6 },
});
