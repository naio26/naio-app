import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { InfoBox, OptionRow, Screen, ScreenHeader, Txt } from '@/components';
import { AGE_RANGES, AgeRange } from '@/data/types';
import { useProfile } from '@/state/profile';
import { space } from '@/theme';

// Screen 11 — pick a range (never an exact age), then verify it with an ID.
export default function AgeRangeScreen() {
  const { profile, update, setIdPhoto } = useProfile();

  const choose = (range: AgeRange) => {
    // Changing the range means the old verification no longer counts.
    if (range !== profile.ageRange) {
      update({ ageRange: range, ageVerified: false });
      setIdPhoto(null);
    }
    router.push('/setup/verify-age');
  };

  return (
    <Screen
      scroll
      header={<ScreenHeader eyebrow="Your profile" title="Choose your age range" />}
      contentStyle={styles.content}
    >
      <Txt>We show a range, never your exact age. Select yours to continue with verification.</Txt>
      <View style={styles.list}>
        {AGE_RANGES.map((r) => (
          <OptionRow key={r} label={r} selected={profile.ageRange === r} onPress={() => choose(r)} />
        ))}
      </View>
      <InfoBox
        title="Age verified by ID"
        text="After choosing a range, naio asks for an official document. Your ID is never shown to other people."
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: space.xl, paddingBottom: space.xxl, gap: space.xl },
  list: { marginTop: -space.sm },
});
