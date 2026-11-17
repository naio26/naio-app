import { useCallback, useEffect, useMemo, useState } from 'react';
import { router, Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { resetDemoData } from '@/data/api';
import { Account } from '@/data/types';
import { AlertsProvider } from '@/state/alerts';
import { BootContext } from '@/state/boot';
import { ChatProvider } from '@/state/chat';
import { FiltersProvider, SavedFilters } from '@/state/filters';
import { PlansProvider, SavedPlans } from '@/state/plans';
import { ProfileProvider, SavedProfile } from '@/state/profile';
import { SafetyProvider, SavedSafety } from '@/state/safety';
import { SessionProvider } from '@/state/session';
import { clearAll, loadAll } from '@/state/storage';
import { colors, fontAssets } from '@/theme';

SplashScreen.preventAutoHideAsync();

type Saved = Awaited<ReturnType<typeof loadAll>>;

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(fontAssets);
  // What was saved on the phone last time (read once at start-up).
  const [saved, setSaved] = useState<Saved | null>(null);
  // Bumped by "Reset demo": everything below is rebuilt from scratch.
  const [epoch, setEpoch] = useState(0);

  useEffect(() => {
    loadAll().then(setSaved);
  }, []);

  const ready = (fontsLoaded || !!fontError) && saved !== null;
  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  const resetDemo = useCallback(async () => {
    await clearAll();
    resetDemoData();
    setSaved({});
    setEpoch((e) => e + 1);
  }, []);

  // After a reset, start again at the intro.
  useEffect(() => {
    if (epoch > 0) router.replace('/reel');
  }, [epoch]);

  const boot = useMemo(() => ({ resetDemo }), [resetDemo]);

  // Keep the splash screen up until the fonts and the saved progress are ready.
  if (!ready) return null;

  return (
    <SafeAreaProvider>
      <BootContext.Provider value={boot}>
        <SessionProvider key={`s${epoch}`} initial={saved.session as Account | null | undefined}>
          <ProfileProvider initial={saved.profile as SavedProfile | undefined}>
            <FiltersProvider initial={saved.filters as SavedFilters | undefined}>
              <SafetyProvider initial={saved.safety as SavedSafety | undefined}>
                <AlertsProvider>
                  <ChatProvider>
                    <PlansProvider initial={saved.plans as SavedPlans | undefined}>
                      <StatusBar style="dark" />
                      <Stack
                        screenOptions={{
                          headerShown: false,
                          contentStyle: { backgroundColor: colors.cream },
                        }}
                      >
                        <Stack.Screen name="(onboarding)/reel" options={{ animation: 'fade' }} />
                        <Stack.Screen name="(tabs)" options={{ animation: 'fade', gestureEnabled: false }} />
                        <Stack.Screen name="filters" options={{ presentation: 'modal' }} />
                        <Stack.Screen
                          name="setup/take-id"
                          options={{
                            animation: 'fade',
                            contentStyle: { backgroundColor: '#161311' },
                          }}
                        />
                        <Stack.Screen name="setup/welcome" options={{ animation: 'fade', gestureEnabled: false }} />
                      </Stack>
                    </PlansProvider>
                  </ChatProvider>
                </AlertsProvider>
              </SafetyProvider>
            </FiltersProvider>
          </ProfileProvider>
        </SessionProvider>
      </BootContext.Provider>
    </SafeAreaProvider>
  );
}
