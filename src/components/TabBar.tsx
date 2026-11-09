import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { Icon, type IconName } from './Icon';
import { useAlerts } from '@/state/alerts';
import { usePlans } from '@/state/plans';
import { colors, fonts, icon, shadow } from '@/theme';
import { Txt } from './Txt';

const tabs: Record<string, { label: string; icon: IconName }> = {
  map: { label: 'Map', icon: 'map' },
  plans: { label: 'Plans', icon: 'book-open' },
  alerts: { label: 'Alerts', icon: 'bell' },
  profile: { label: 'Profile', icon: 'user' },
};

/** Map | Plans | (+) | Alerts | Profile. The "+" is not a tab: it opens Create a plan on top. */
export function TabBar({ state, emitter, navigateToTab, insets }: BottomTabBarProps) {
  const { unread } = useAlerts();
  const { requests, plans } = usePlans();
  // Small numbers on the tabs: unread alerts, and people waiting for your answer.
  const badges: Record<string, number> = {
    alerts: unread,
    plans: requests.filter((r) => r.status === 'pending' && plans.some((p) => p.id === r.planId)).length,
  };
  const items = state.routes.map((route, index) => {
    const meta = tabs[route.name];
    if (!meta) return null;
    const focused = state.index === index;
    const tint = focused ? colors.accent : colors.faint;

    const onPress = () => {
      const event = emitter.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
      if (!focused && !event.defaultPrevented) navigateToTab(route.key);
    };

    return (
      <Pressable
        key={route.key}
        accessibilityRole="tab"
        accessibilityState={{ selected: focused }}
        accessibilityLabel={badges[route.name] ? `${meta.label}, ${badges[route.name]} new` : meta.label}
        onPress={onPress}
        style={styles.tab}
      >
        <View>
          <Icon name={meta.icon} size={icon.tab} color={tint} />
          {badges[route.name] > 0 && (
            <View style={styles.badge}>
              <Txt style={styles.badgeText}>{badges[route.name]}</Txt>
            </View>
          )}
        </View>
        <Txt style={[styles.label, { color: tint }]}>{meta.label}</Txt>
      </Pressable>
    );
  });

  const plus = (
    <View key="plus" style={styles.tab}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Create a plan"
        onPress={() => router.push('/create')}
        style={({ pressed }) => [styles.plus, pressed && { transform: [{ scale: 0.95 }] }]}
      >
        <Icon name="plus" size={30} color={colors.white} />
      </Pressable>
    </View>
  );

  // Insert the "+" button in the middle of the four tabs.
  const visible = items.filter(Boolean);
  visible.splice(2, 0, plus);

  return <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 10) }]}>{visible}</View>;
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: colors.cream,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 10,
  },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', gap: 4 },
  label: { fontFamily: fonts.sans, fontSize: 12, lineHeight: 15 },
  badge: {
    position: 'absolute',
    top: -6,
    right: -12,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 4,
    backgroundColor: colors.accentFill,
    borderWidth: 2,
    borderColor: colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { fontFamily: fonts.sansBold, fontSize: 10, lineHeight: 12, color: colors.white },
  plus: {
    width: 56,
    height: 56,
    borderRadius: 20,
    backgroundColor: colors.accentFill,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -28,
    marginBottom: 6,
    ...shadow.button,
  },
});
