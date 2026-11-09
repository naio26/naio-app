import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AlertsProvider } from '@/state/alerts';
import { ChatProvider } from '@/state/chat';
import { FiltersProvider } from '@/state/filters';
import { SafetyProvider } from '@/state/safety';
import { PlansProvider } from '@/state/plans';
import { ProfileProvider } from '@/state/profile';
import { SessionProvider } from '@/state/session';
import { colors, fontAssets } from '@/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts(fontAssets);

  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync();
  }, [loaded, error]);

  // Keep the splash screen up until the fonts are ready, so text never "jumps".
  if (!loaded && !error) return null;

  return (
    <SafeAreaProvider>
      <SessionProvider>
        <ProfileProvider>
          <FiltersProvider>
            <SafetyProvider>
              <AlertsProvider>
                <ChatProvider>
                  <PlansProvider>
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
    </SafeAreaProvider>
  );
}
