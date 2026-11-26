import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Icon, type IconName } from '@/components';
import { Logo, ProfileView, Screen, Txt } from '@/components';
import { availabilityText } from '@/data/catalog';
import { useProfile } from '@/state/profile';
import { colors, radius, space } from '@/theme';

// Screen 42 — your profile, as others see it.
export default function ProfileTab() {
  const { profile } = useProfile();
  return (
    <Screen scroll edges={['top']} contentStyle={styles.content}>
      <View style={styles.top}>
        <Logo />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Settings"
          hitSlop={12}
          onPress={() => router.push('/settings')}
        >
          <Icon name="settings" color={colors.dark} />
        </Pressable>
      </View>
      {/* Open to plans: shows you on the map in orange (Now, or Today / Tomorrow + parts of the day). */}
      <Pressable
        accessibilityRole="button"
        onPress={() => router.push('/available')}
        style={({ pressed }) => [styles.open, pressed && { opacity: 0.7 }]}
      >
        <View style={[styles.dot, !profile.available && styles.dotOff]} />
        <View style={{ flex: 1, gap: 2 }}>
          <Txt variant="bodyStrong">Open to plans</Txt>
          <Txt variant="small" color={profile.available ? colors.openToPlans : colors.muted}>
            {profile.available ? availabilityText(profile.available) : 'Off · show people you’re free to join a plan'}
          </Txt>
        </View>
        <Icon name="chevron-right" color={colors.muted} />
      </Pressable>
      <ProfileView profile={profile} onEdit={() => router.push('/setup/profile')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: space.xl },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: space.lg },
  open: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: space.lg,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dot: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.openToPlans },
  dotOff: { backgroundColor: colors.border },
});
