import { useRef, useState } from 'react';
import { ActivityIndicator, Animated, Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackButton, CornerFrame, IdCardArt, Txt } from '@/components';
import { checkIdPhoto } from '@/data/api';
import { useProfile } from '@/state/profile';
import { colors, fonts, radius, space } from '@/theme';

// Screen 14 — fake camera for the ID photo. The design export was broken, so this is a dark camera screen.
export default function TakeId() {
  const { setIdPhoto } = useProfile();
  const [busy, setBusy] = useState(false);
  const flash = useRef(new Animated.Value(0)).current;

  const shoot = async () => {
    setBusy(true);
    Animated.sequence([
      Animated.timing(flash, { toValue: 1, duration: 80, useNativeDriver: true }),
      Animated.timing(flash, { toValue: 0, duration: 320, useNativeDriver: true }),
    ]).start();
    await checkIdPhoto();
    setIdPhoto({ source: 'camera' });
    router.back();
  };

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar style="light" />
      <View style={styles.top}>
        <BackButton color={colors.white} />
        <Txt style={styles.title}>Take ID photo</Txt>
        <View style={{ width: 32 }} />
      </View>

      <LinearGradient colors={['#3A3531', '#221E1B']} style={styles.viewfinder}>
        <View style={styles.frame}>
          <View style={StyleSheet.absoluteFill}>
            <CornerFrame width="100%" height={220} size={36} thickness={3} />
          </View>
          <IdCardArt width={250} tone="dim" />
        </View>
        <Txt style={styles.hint}>{busy ? 'Checking the photo…' : 'Keep the document flat and inside the frame'}</Txt>
      </LinearGradient>

      <Txt style={styles.tips}>Good light · No glare · All corners visible</Txt>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Take photo"
        disabled={busy}
        onPress={shoot}
        style={({ pressed }) => [styles.shutter, pressed && { transform: [{ scale: 0.94 }] }]}
      >
        <View style={styles.shutterInner}>{busy && <ActivityIndicator color={colors.dark} />}</View>
      </Pressable>

      <Txt style={styles.footnote}>Encrypted during verification and removed after the result is recorded.</Txt>

      <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.flash, { opacity: flash }]} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#161311', paddingHorizontal: space.lg },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: space.sm },
  title: { fontFamily: fonts.sansBold, fontSize: 17, color: colors.white },
  viewfinder: {
    flex: 1,
    marginTop: space.lg,
    borderRadius: radius.lg + 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 28,
  },
  frame: { width: '100%', height: 220, alignItems: 'center', justifyContent: 'center' },
  hint: { fontFamily: fonts.sansMedium, fontSize: 18, lineHeight: 25, color: colors.white, textAlign: 'center' },
  tips: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginTop: space.lg,
  },
  shutter: {
    alignSelf: 'center',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: space.lg,
  },
  shutterInner: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footnote: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: 'rgba(255,255,255,0.55)',
    textAlign: 'center',
    marginVertical: space.md,
  },
  flash: { backgroundColor: colors.white },
});
