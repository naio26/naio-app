import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, AppState, BackHandler, Linking, Platform, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Button } from './Button';
import { Icon, type IconName } from './Icon';
import { Logo } from './Logo';
import { Screen } from './Screen';
import { Txt } from './Txt';
import { VerifiedBadge } from './VerifiedBadge';
import { useCity } from '@/state/city';
import { useFilters } from '@/state/filters';
import { useProfile } from '@/state/profile';
import { LocationAccess, useSafety } from '@/state/safety';
import { colors, icon, space } from '@/theme';

type Step = 'ask' | 'granted' | 'denied';

/**
 * The location permission pop-up (looks like the phone's own one), with the short reason.
 * Shown right after "Create profile" (20). Demo: simulated, no real location is read.
 */
export function askLocation(onAnswer: (a: 'granted' | 'denied') => void) {
  if (Platform.OS === 'web') return onAnswer('granted');
  Alert.alert(
    'Allow “naio.” to use your location?',
    'naio shows plans and people near you. Only an approximate area is used, never your exact location.',
    [
      { text: 'Don’t allow', style: 'cancel', onPress: () => onAnswer('denied') },
      { text: 'Allow while using the app', onPress: () => onAnswer('granted') },
    ],
    { cancelable: false },
  );
}

/**
 * Screen 21 — opened right after the location pop-up of "Create profile" (20). naio can't be used without location:
 *  - allowed → "You're all set!" + "Welcome to {city}, {name}." → "Find plans nearby" → map with "First things first",
 *  - not allowed → a blocking screen: "Turn on location" opens the phone settings; coming back = on (demo),
 *  - not answered yet (app closed while the pop-up was open) → a short "Plans near you" screen that asks again.
 * Cream background (option A1, chosen by the owner). From Settings → Demo it opens with
 * ?demo=ask|granted|denied: a preview that doesn't change what's saved.
 */
export function AllSet() {
  const { demo } = useLocalSearchParams<{ demo?: string }>();
  const preview = demo === 'ask' || demo === 'granted' || demo === 'denied';
  const city = useCity();
  const { profile } = useProfile();
  const { locationAccess, setLocationAccess } = useSafety();
  const { setIntroSeen } = useFilters();

  const [step, setStep] = useState<Step>(() => {
    if (preview) return demo as Step;
    return locationAccess === 'unknown' ? 'ask' : locationAccess;
  });
  const answer = useCallback(
    (a: Exclude<LocationAccess, 'unknown'>) => {
      setStep(a);
      if (!preview) setLocationAccess(a);
    },
    [preview, setLocationAccess],
  );

  // Only if the question wasn't answered yet (app closed while the pop-up was open, or Demo → test the question).
  const ask = useCallback(() => askLocation(answer), [answer]);
  useEffect(() => {
    if (step !== 'ask') return;
    const t = setTimeout(ask, 500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Blocking screen: "Turn on location" opens the phone settings. Demo: coming back counts as turned on.
  const wentToSettings = useRef(false);
  const turnOn = () => {
    if (Platform.OS === 'web') return answer('granted');
    wentToSettings.current = true;
    Linking.openSettings();
  };
  useEffect(() => {
    const sub = AppState.addEventListener('change', (s) => {
      if (s === 'active' && wentToSettings.current) {
        wentToSettings.current = false;
        answer('granted');
      }
    });
    return () => sub.remove();
  }, [answer]);

  // No way around it (Android back button) until location is on.
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => sub.remove();
  }, []);

  const openMap = () => {
    if (preview) setIntroSeen(false); // so the preview also shows "First things first"
    router.dismissAll();
    router.replace('/map');
  };

  const view: Record<
    Step,
    {
      icon: IconName;
      label?: string;
      title: string;
      sub?: string;
      text: string;
      button: ActionButton;
    }
  > = {
    ask: {
      icon: 'map-pin',
      title: 'Plans near you',
      text: 'naio needs your location to show plans and people nearby. Only an approximate area is used.',
      button: { title: 'Allow location', onPress: ask },
    },
    granted: {
      icon: 'check',
      label: 'Profile created',
      title: 'You’re all set!',
      // City from the location (demo: always the mock city), name from the profile.
      sub: profile.firstName ? `Welcome to ${city.name}, ${profile.firstName}.` : `Welcome to ${city.name}.`,
      text: 'See who’s around and join a plan today.',
      button: { title: 'Find plans nearby', onPress: openMap },
    },
    denied: {
      icon: 'map-pin',
      title: 'naio. needs your location to show plans nearby',
      text: 'Turn on location for naio in your phone settings, then come back here.',
      button: { title: 'Turn on location', onPress: turnOn },
    },
  };
  const v = view[step];

  return (
    <Screen contentStyle={styles.content} footer={<Button title={v.button.title} arrow onPress={v.button.onPress} />}>
      <Logo size={30} />
      <View style={styles.center}>
        <Icon name={v.icon} size={icon.hero} color={colors.accent} />
        {v.label && (
          <Txt variant="eyebrow" style={{ letterSpacing: 1.6 }}>
            {v.label}
          </Txt>
        )}
        <Txt variant="display" center style={step !== 'granted' && styles.longTitle}>
          {v.title}
        </Txt>
        {v.sub && (
          <Txt variant="display" color={colors.accentLight} center style={styles.sub}>
            {v.sub}
          </Txt>
        )}
        <Txt variant="body" center style={[styles.line, step === 'denied' && styles.smallLine]}>
          {v.text}
        </Txt>
      </View>
      {step === 'granted' && <VerifiedBadge />}
    </Screen>
  );
}

type ActionButton = { title: string; onPress: () => void };

const styles = StyleSheet.create({
  content: { paddingTop: space.xl, paddingBottom: space.lg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14 },
  longTitle: { fontSize: 32, lineHeight: 38 },
  // "Welcome to {city}, {name}.": soft light terracotta, a bit smaller and lower than the title.
  sub: { fontSize: 24, lineHeight: 30, marginTop: space.sm },
  smallLine: { fontSize: 14, lineHeight: 20 },
  line: { maxWidth: 300, marginTop: space.xs },
});
