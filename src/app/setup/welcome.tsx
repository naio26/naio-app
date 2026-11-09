import { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Logo, Txt } from '@/components';
import { CITY } from '@/data/catalog';
import { useProfile } from '@/state/profile';
import { colors, fonts, space } from '@/theme';

const STAY_MS = 3200;

// Screen 21 — a short welcome that moves on to the map by itself (tap to skip).
export default function Welcome() {
  const insets = useSafeAreaInsets();
  const { profile } = useProfile();
  const intro = useRef(new Animated.Value(0)).current;
  const drift = useRef(new Animated.Value(0)).current;
  const left = useRef(false);

  const goOn = () => {
    if (left.current) return;
    left.current = true;
    // Clear the sign-up screens so "back" can't return to them, then open the app.
    router.dismissAll();
    router.replace('/map');
  };

  useEffect(() => {
    Animated.timing(intro, {
      toValue: 1,
      duration: 900,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(drift, { toValue: 1, duration: 2600, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(drift, { toValue: 0, duration: 2600, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]),
    ).start();
    const t = setTimeout(goOn, STAY_MS);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rise = (from: number) => ({
    opacity: intro,
    transform: [{ translateY: intro.interpolate({ inputRange: [0, 1], outputRange: [from, 0] }) }],
  });
  const float = (px: number) => ({
    transform: [{ translateY: drift.interpolate({ inputRange: [0, 1], outputRange: [0, px] }) }],
  });

  return (
    <Pressable accessibilityRole="button" accessibilityLabel="Continue" onPress={goOn} style={styles.root}>
      <StatusBar style="light" />

      {/* Diagonal bands and soft circles at the bottom. */}
      <View style={[styles.band, { backgroundColor: colors.brandBand, bottom: -120 }]} />
      <View style={[styles.band, { backgroundColor: colors.brandBandDeep, bottom: -270 }]} />
      <Animated.View style={[styles.dot, { width: 62, height: 62, left: 40, bottom: '19%' }, float(-10)]} />
      <Animated.View style={[styles.dot, { width: 26, height: 26, right: 84, bottom: '28%' }, float(8)]} />
      <Animated.View style={[styles.dot, { width: 100, height: 100, right: 34, bottom: '7%' }, float(-14)]} />

      <View style={[styles.content, { paddingTop: insets.top + 24 }]}>
        <Logo size={64} color={colors.white} dotColor={colors.brandInk} />

        <Animated.View style={[styles.hello, rise(24)]}>
          <Txt style={styles.hi}>Hi {profile.firstName || 'there'}!</Txt>
          <Txt style={styles.big}>
            Welcome to{'\n'}
            <Txt style={[styles.big, { color: colors.brandInk }]}>{CITY}.</Txt>
          </Txt>
        </Animated.View>

        <Animated.View style={[styles.taglineWrap, rise(12)]}>
          <Txt style={styles.tagline}>Your people are closer than you think.</Txt>
        </Animated.View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.brand, overflow: 'hidden' },
  content: { flex: 1, paddingHorizontal: space.gutter + 2 },
  hello: { marginTop: '38%', gap: 18 },
  hi: { fontFamily: fonts.sansBold, fontSize: 20, color: colors.white },
  big: { fontFamily: fonts.serif, fontSize: 56, lineHeight: 62, color: colors.white, letterSpacing: -1 },
  taglineWrap: { position: 'absolute', top: '66%', left: space.gutter + 2, right: space.gutter },
  tagline: { fontFamily: fonts.sansBold, fontSize: 16, color: colors.white },
  band: { position: 'absolute', left: -100, right: -100, height: 400, transform: [{ rotate: '-16deg' }] },
  dot: { position: 'absolute', borderRadius: 999, backgroundColor: colors.brandGlow },
});
