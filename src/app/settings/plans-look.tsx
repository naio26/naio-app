import { StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ProfileView, Screen, ScreenHeader } from '@/components';
import { useProfile } from '@/state/profile';
import { space } from '@/theme';

// TEST ONLY (Settings → Demo): My profile with option A or B of "My kind of plans", to compare.
// The Profile tab keeps the current version until the owner chooses.
export default function PlansLookPreview() {
  const { v } = useLocalSearchParams<{ v?: string }>();
  const look = v === 'B' ? 'B' : 'A';
  const { profile } = useProfile();
  return (
    <Screen
      scroll
      edges={['top', 'bottom']}
      header={<ScreenHeader eyebrow="Demo · compare" title={`My kind of plans - ${look}`} />}
      contentStyle={styles.content}
    >
      <ProfileView profile={profile} plansLook={look} onEdit={() => router.push('/setup/profile')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: space.xl },
});
