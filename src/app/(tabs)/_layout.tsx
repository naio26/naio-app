import { Redirect } from 'expo-router';
import { Tabs } from 'expo-router/js-tabs';
import { TabBar } from '@/components';
import { useSafety } from '@/state/safety';
import { colors } from '@/theme';

export default function TabsLayout() {
  // naio can't be used without location: no map or tabs until it's allowed.
  const { locationAccess } = useSafety();
  if (locationAccess !== 'granted') return <Redirect href="/" />; // "/" opens the location step (or the intro if there's no profile)
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.cream },
      }}
    >
      <Tabs.Screen name="map" />
      <Tabs.Screen name="plans" />
      <Tabs.Screen name="alerts" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
