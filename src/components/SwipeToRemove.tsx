import { ReactNode, useRef } from 'react';
import { Animated, PanResponder, Pressable, StyleSheet, View } from 'react-native';
import { colors, fonts, radius } from '@/theme';
import { Txt } from './Txt';

const ACTION = 96; // width of the "Remove" action

/** Swipe the row to the left to show a "Remove" action behind it (cancelled plans in My plans). */
export function SwipeToRemove({ children, onRemove }: { children: ReactNode; onRemove: () => void }) {
  const x = useRef(new Animated.Value(0)).current;
  const open = useRef(false);
  const snap = (to: number) => {
    open.current = to !== 0;
    Animated.spring(x, { toValue: to, damping: 20, stiffness: 220, useNativeDriver: true }).start();
  };
  const pan = useRef(
    PanResponder.create({
      // Only clear sideways swipes; vertical moves keep scrolling the list.
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 10 && Math.abs(g.dx) > Math.abs(g.dy) * 1.5,
      onPanResponderMove: (_, g) =>
        x.setValue(Math.min(0, Math.max(-ACTION - 24, (open.current ? -ACTION : 0) + g.dx))),
      onPanResponderRelease: (_, g) => snap((open.current ? -ACTION : 0) + g.dx < -ACTION / 2 ? -ACTION : 0),
      onPanResponderTerminate: () => snap(open.current ? -ACTION : 0),
    }),
  ).current;

  return (
    <View style={styles.wrap}>
      <Pressable accessibilityRole="button" accessibilityLabel="Remove" onPress={onRemove} style={styles.action}>
        <Txt style={styles.actionText}>Remove</Txt>
      </Pressable>
      {/* Opaque background, so the action never shows through a faded card. */}
      <Animated.View style={[styles.front, { transform: [{ translateX: x }] }]} {...pan.panHandlers}>
        {children}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { borderRadius: radius.lg + 2, overflow: 'hidden' },
  action: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    width: ACTION + 24,
    paddingLeft: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.danger,
  },
  front: { backgroundColor: colors.cream },
  actionText: { fontFamily: fonts.sansBold, fontSize: 14, color: colors.white },
});
