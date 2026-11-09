import { Tabs } from 'expo-router/js-tabs';
import { TabBar } from '@/components';
import { colors } from '@/theme';

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.cream } }}
    >
      <Tabs.Screen name="map" />
      <Tabs.Screen name="plans" />
      <Tabs.Screen name="alerts" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
