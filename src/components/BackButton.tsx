import { Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { colors, icon } from '@/theme';
import { Icon } from './Icon';

type Props = {
  onPress?: () => void;
  /** Chevron colour, e.g. white on the dark camera screen. */
  color?: string;
};

/**
 * Go to the previous screen. If there is none (the app was opened or reloaded on this screen),
 * go to the start instead, which opens the map or the intro. Never throws "GO_BACK was not handled".
 */
export function goBack() {
  if (router.canGoBack()) router.back();
  else router.replace('/');
}

/** A plain "‹", the same on every screen (no circle). */
export function BackButton({ onPress, color = colors.dark }: Props) {
  const handlePress = onPress ?? goBack;
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
