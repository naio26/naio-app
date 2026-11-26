import { ReactNode, useEffect, useRef, useState } from 'react';
import { Animated, Easing, PanResponder, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Icon, type IconName } from './Icon';
import { colors, shadow, space } from '@/theme';

/** Card that slides up from the bottom of the map (plan 26, person 28). */
export function BottomSheet({
  visible,
  onClose,
  children,
  backdrop,
  grabber = true,
}: {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  /** Dim the screen behind (tap it to close). Used over normal screens; the map keeps it off. */
  backdrop?: boolean;
  /** The small drag line at the top. Off on the profile card (swipe down still closes it). */
  grabber?: boolean;
}) {
  const y = useRef(new Animated.Value(600)).current;
  const [mounted, setMounted] = useState(visible);
  // Swipe down to close (only when the content is scrolled to the top).
  const scrollY = useRef(0);
  const close = useRef(onClose);
  close.current = onClose;
  const pan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponderCapture: (_, g) => scrollY.current <= 0 && g.dy > 10 && g.dy > Math.abs(g.dx) * 1.5,
      onPanResponderMove: (_, g) => y.setValue(Math.max(0, g.dy)),
      onPanResponderRelease: (_, g) => {
        if (g.dy > 100 || g.vy > 0.8) close.current();
        else Animated.spring(y, { toValue: 0, damping: 20, stiffness: 180, useNativeDriver: true }).start();
      },
      onPanResponderTerminate: () =>
        Animated.spring(y, { toValue: 0, damping: 20, stiffness: 180, useNativeDriver: true }).start(),
    }),
  ).current;

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
    <>
      {backdrop && (
        <Pressable
          accessibilityLabel="Close"
          onPress={onClose}
          style={[StyleSheet.absoluteFill, styles.backdrop, !visible && { opacity: 0 }]}
        />
      )}
      <Animated.View style={[styles.sheet, { transform: [{ translateY: y }] }]} {...pan.panHandlers}>
        {grabber && <View style={styles.grabber} />}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close"
          hitSlop={10}
          onPress={onClose}
          style={styles.close}
        >
          <Icon name="x" color={colors.dark} />
        </Pressable>
        <ScrollView
          scrollEventThrottle={16}
          onScroll={(e) => {
            scrollY.current = e.nativeEvent.contentOffset.y;
          }}
          bounces={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          {children}
        </ScrollView>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: { backgroundColor: colors.overlay, opacity: 0.6 },
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
