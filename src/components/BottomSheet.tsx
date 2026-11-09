import { ReactNode, useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Icon, type IconName } from './Icon';
import { colors, shadow, space } from '@/theme';

/** Card that slides up from the bottom of the map (plan 26, person 28). */
export function BottomSheet({
  visible,
  onClose,
  children,
}: {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  const y = useRef(new Animated.Value(600)).current;
  const [mounted, setMounted] = useState(visible);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      Animated.spring(y, { toValue: 0, damping: 20, stiffness: 180, useNativeDriver: true }).start();
    } else {
      Animated.timing(y, { toValue: 600, duration: 220, easing: Easing.in(Easing.quad), useNativeDriver: true }).start(
        ({ finished }) => finished && setMounted(false),
      );
    }
  }, [visible, y]);

  if (!mounted) return null;
  return (
    <Animated.View style={[styles.sheet, { transform: [{ translateY: y }] }]}>
      <View style={styles.grabber} />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Close"
        hitSlop={10}
        onPress={onClose}
        style={styles.close}
      >
        <Icon name="x" color={colors.dark} />
      </Pressable>
      <ScrollView bounces={false} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {children}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    maxHeight: '78%',
    backgroundColor: colors.cream,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    ...shadow.soft,
    shadowOpacity: 0.16,
    elevation: 12,
  },
  grabber: {
    alignSelf: 'center',
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.border,
    marginTop: 10,
  },
  close: { position: 'absolute', top: 18, right: 22, zIndex: 2, padding: 4 },
  content: { paddingHorizontal: space.gutter, paddingTop: space.lg, paddingBottom: space.xl },
});
