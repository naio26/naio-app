import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Icon, type IconName } from '@/components';
import { BackButton, Button, CornerFrame, Screen, Txt } from '@/components';
import { checkFace } from '@/data/api';
import { useProfile } from '@/state/profile';
import { colors, fonts, radius, space } from '@/theme';

const CHECKS = ['One face detected', 'Live camera check', 'Basic anti-fake check'];
const OVAL_W = 176;
const OVAL_H = 236;

// Screen 10 — fake live selfie check. No camera is used: the oval is a drawing.
export default function FaceCheck() {
  const { update } = useProfile();
  const [phase, setPhase] = useState<'idle' | 'checking' | 'done'>('idle');
  const [passed, setPassed] = useState(0);
  const scan = useRef(new Animated.Value(0)).current;

  // The green line sweeps up and down the oval, like a scanner.
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scan, { toValue: 1, duration: 1400, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(scan, { toValue: 0, duration: 1400, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [scan]);

  const takePhoto = async () => {
    setPhase('checking');
    // Tick the three checks one after the other while the fake check runs.
    const timers = CHECKS.map((_, i) => setTimeout(() => setPassed(i + 1), 450 * (i + 1)));
    await checkFace();
    timers.forEach(clearTimeout);
    setPassed(CHECKS.length);
    setPhase('done');
    update({ photoChecked: true });
    setTimeout(() => router.back(), 700);
  };

  const caption = { idle: 'Move your face into the oval', checking: 'Hold still…', done: 'Looking good!' }[phase];

  return (
    <Screen
      scroll
      contentStyle={styles.content}
      footer={
        <Button
          title={phase === 'done' ? 'Photo checked' : 'Take photo'}
          arrow
          loading={phase === 'checking'}
          disabled={phase === 'done'}
          onPress={takePhoto}
        />
      }
    >
      <View style={styles.back}>
        <BackButton />
      </View>

      <View style={styles.hero}>
        <Txt variant="eyebrow">One quick check</Txt>
        <Txt variant="display">Show us it’s really you.</Txt>
        <Txt>Take a live photo. We’ll check that one real face is present and that it isn’t a photo of a photo.</Txt>
      </View>

      <LinearGradient
        colors={['#B3ABA3', '#8F877F', '#6E655E']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.camera}
      >
        <View style={styles.ovalArea}>
          <View style={styles.frame}>
            <CornerFrame width={OVAL_W + 4} height={OVAL_H * 0.82} color={colors.green} size={22} thickness={3} />
          </View>
          <View style={styles.oval} />
          <View style={styles.faceWrap}>
            <LinearGradient colors={['#B88E78', '#9A6E5E', '#87594B']} style={styles.face} />
          </View>
          <Animated.View
            style={[
              styles.scanLine,
              {
                transform: [
                  { translateY: scan.interpolate({ inputRange: [0, 1], outputRange: [OVAL_H * 0.18, OVAL_H * 0.82] }) },
                ],
              },
            ]}
          />
        </View>
        <Txt style={styles.caption}>{caption}</Txt>
      </LinearGradient>

      <View style={styles.pills}>
        {CHECKS.map((c, i) => {
          const ok = i < passed || phase === 'idle';
          return (
            <View key={c} style={styles.pill}>
              <Icon name={ok ? 'check' : 'loader'} color={ok ? colors.green : colors.faint} />
              <Txt style={[styles.pillText, !ok && { color: colors.faint }]}>{c}</Txt>
            </View>
          );
        })}
      </View>

      <Txt variant="caption" center style={styles.note}>
        This only confirms that a live face is in front of the camera. It is not matched with your ID; age verification
        happens separately.
      </Txt>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: space.lg },
  back: { marginTop: space.lg },
  hero: { gap: 12, marginTop: space.xl },
  camera: {
    marginTop: space.xl,
    borderRadius: radius.lg + 10,
    height: 320,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  ovalArea: { width: OVAL_W + 4, height: OVAL_H, alignItems: 'center', justifyContent: 'center' },
  frame: { position: 'absolute' },
  // RN can't draw ovals directly: draw circles and stretch them vertically.
  oval: {
    position: 'absolute',
    width: OVAL_W,
    height: OVAL_W,
    borderRadius: OVAL_W / 2,
    borderWidth: 2.2,
    borderColor: colors.white,
    backgroundColor: 'rgba(255,255,255,0.18)',
    transform: [{ scaleY: OVAL_H / OVAL_W }],
  },
  faceWrap: {
    position: 'absolute',
    bottom: 4,
    width: OVAL_W * 0.76,
    height: OVAL_W * 0.76,
    borderRadius: OVAL_W,
    overflow: 'hidden',
    transform: [{ scaleY: 1.32 }, { translateY: -14 }],
  },
  face: { flex: 1 },
  scanLine: { position: 'absolute', top: 0, left: 12, right: 12, height: 1.5, backgroundColor: '#7EE0A6' },
  caption: { position: 'absolute', bottom: 16, fontFamily: fonts.sansMedium, fontSize: 14, color: colors.white },
  pills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    columnGap: 14,
    rowGap: 6,
    marginTop: space.lg,
  },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  pillText: { fontFamily: fonts.sans, fontSize: 13, color: colors.green },
  note: { marginTop: space.md, lineHeight: 17 },
});
