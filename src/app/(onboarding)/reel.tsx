import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Logo, Txt } from '@/components';
import { colors, fonts, space } from '@/theme';

const SLIDE_MS = 5000;
const HOLD_MS = 250; // shorter than this counts as a tap, longer as "hold to pause"

// Screens 01–05. Photos are optimized copies (1170px JPEG) of the originals in assets/Reel.
const slides = [
  {
    eyebrow: 'Keen to meet',
    title: 'Find your people.',
    body: 'Those nearby who are keen to do something like you.',
    photo: require('../../../assets/images/reel/01.jpg'),
  },
  {
    eyebrow: 'Your mood sets the map',
    title: 'Join a plan.',
    body: 'Coffee in 20 minutes? A sunset swim? Pick one or create your own.',
    photo: require('../../../assets/images/reel/02.jpg'),
  },
  {
    eyebrow: 'Ready when you are',
    title: 'Go off script.',
    body: 'A last-minute yes. A new favourite spot. Or a story for later.',
    photo: require('../../../assets/images/reel/03.jpg'),
  },
  {
    eyebrow: 'Now or never',
    title: 'Share moments.',
    body: 'Make memories with people you just met.',
    photo: require('../../../assets/images/reel/04.jpg'),
  },
  {
    eyebrow: 'Go with your flow',
    title: 'And have fun.',
    body: 'Make the most of where you are.',
    photo: require('../../../assets/images/reel/05.jpg'),
  },
] as const;

export default function Reel() {
  const insets = useSafeAreaInsets();
  const [index, setIndex] = useState(0);
  const progress = useRef(new Animated.Value(0)).current;
  const zoom = useRef(new Animated.Value(1)).current;
  const fade = useRef(new Animated.Value(1)).current;
  const held = useRef(false);
  const pausedAt = useRef(0);
  const widthRef = useRef(1);

  // Fill the current progress bar from `from` (0–1) to the end, then go to the next slide.
  const run = useCallback(
    (from: number) => {
      progress.setValue(from);
      Animated.timing(progress, {
        toValue: 1,
        duration: SLIDE_MS * (1 - from),
        easing: Easing.linear,
        useNativeDriver: false,
      }).start(({ finished }) => {
        if (finished) setIndex((i) => (i + 1) % slides.length);
      });
    },
    [progress],
  );

  // Every time the slide changes: restart the bar, fade in and slowly zoom the photo.
  useEffect(() => {
    run(0);
    fade.setValue(0.3);
    zoom.setValue(1);
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 450, useNativeDriver: true }),
      Animated.timing(zoom, {
        toValue: 1.12,
        duration: SLIDE_MS + 800,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
    return () => progress.stopAnimation();
  }, [index, run, fade, zoom, progress]);

  const goTo = (next: number) => {
    const target = (next + slides.length) % slides.length;
    if (target === index) run(0);
    else setIndex(target);
  };

  // Hold anywhere to pause; tap the left third to go back, anywhere else to go forward.
  const pause = () => {
    progress.stopAnimation((value) => {
      pausedAt.current = value;
    });
  };

  const onPressOut = () => {
    if (held.current) {
      held.current = false;
      run(pausedAt.current);
    }
  };

  const onTap = (x: number) => {
    goTo(x < widthRef.current / 3 ? index - 1 : index + 1);
  };

  const start = () => router.push('/sign-up');
  const slide = slides[index];

  return (
    <View style={styles.root} onLayout={(e) => (widthRef.current = e.nativeEvent.layout.width)}>
      <StatusBar style="light" />

      {/* All five photos stay mounted so the next one is already loaded; only the current one is visible. */}
      {slides.map((s, i) => (
        <Animated.View
          key={i}
          style={[
            StyleSheet.absoluteFill,
            i === index ? { opacity: fade, transform: [{ scale: zoom }] } : { opacity: 0 },
          ]}
        >
          <Image source={s.photo} resizeMode="cover" style={styles.photo} />
        </Animated.View>
      ))}
      {/* Dark gradient on top of the photo: a soft shade behind the logo and Skip, a strong one behind the text. */}
      <LinearGradient
        colors={['rgba(18,14,12,0.45)', 'rgba(18,14,12,0)']}
        locations={[0, 0.22]}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={['rgba(18,14,12,0)', 'rgba(18,14,12,0.55)', 'rgba(18,14,12,0.9)']}
        locations={[0.4, 0.66, 1]}
        style={StyleSheet.absoluteFill}
      />

      <View style={[styles.top, { paddingTop: insets.top + 12 }]}>
        <Logo size={30} color={colors.white} />
        <Pressable accessibilityRole="button" hitSlop={16} onPress={start}>
          <Txt style={styles.skip}>Skip</Txt>
        </Pressable>
      </View>

      <Pressable
        accessibilityLabel="Tap right for next, left for previous. Hold to pause."
        style={styles.stage}
        delayLongPress={HOLD_MS}
        onLongPress={() => {
          held.current = true;
          pause();
        }}
        onPressOut={onPressOut}
        onPress={(e) => onTap(e.nativeEvent.pageX)}
      >
        <Animated.View style={[styles.copy, { opacity: fade }]}>
          <Txt variant="eyebrow" color={colors.reelEyebrow} style={styles.eyebrow}>
            {slide.eyebrow}
          </Txt>
          <Txt style={styles.title}>{slide.title}</Txt>
          <Txt style={styles.body}>{slide.body}</Txt>
        </Animated.View>
      </Pressable>

      <View style={[styles.bottom, { paddingBottom: insets.bottom + 20 }]}>
        <View style={styles.bars}>
          {slides.map((_, i) => (
            <View key={i} style={styles.track}>
              <Animated.View
                style={[
                  styles.fill,
                  {
                    width:
                      i < index
                        ? '100%'
                        : i > index
                          ? '0%'
                          : progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
                  },
                ]}
              />
            </View>
          ))}
        </View>
        <Button title="Get started" variant="glow" arrow="chevron" onPress={start} style={styles.cta} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#120E0C', overflow: 'hidden' },
  photo: { width: '100%', height: '100%' },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: space.gutter,
  },
  skip: { fontFamily: fonts.sansBold, fontSize: 16, color: colors.white },
  stage: { flex: 1, justifyContent: 'flex-end', paddingHorizontal: space.gutter, paddingBottom: 72 },
  copy: { gap: 10 },
  eyebrow: { letterSpacing: 0.6, fontSize: 13 },
  title: { fontFamily: fonts.serif, fontSize: 38, lineHeight: 44, color: colors.white, letterSpacing: -0.3 },
  body: { fontFamily: fonts.sansBold, fontSize: 16, lineHeight: 22, color: colors.white },
  bottom: { paddingHorizontal: space.gutter, gap: 24 },
  bars: { flexDirection: 'row', gap: 4 },
  track: { flex: 1, height: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.35)', overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: colors.white, borderRadius: 2 },
  cta: { minHeight: 60, borderRadius: 18, paddingHorizontal: 22 },
});
