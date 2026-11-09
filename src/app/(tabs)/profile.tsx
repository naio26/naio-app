import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Icon, type IconName } from '@/components';
import { Logo, ProfileView, Screen } from '@/components';
import { useProfile } from '@/state/profile';
import { colors, space } from '@/theme';

// Screen 42 — your profile, as others see it.
export default function ProfileTab() {
  const { profile } = useProfile();
  return (
    <Screen scroll edges={['top']} contentStyle={styles.content}>
      <View style={styles.top}>
        <Logo size={40} />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Settings"
          hitSlop={12}
          onPress={() => router.push('/settings')}
        >
          <Icon name="settings" color={colors.dark} />
        </Pressable>
      </View>
      <ProfileView profile={profile} onEdit={() => router.push('/setup/profile')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: space.xl },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: space.lg },
});
