import { StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { PlanSheet, Screen, ScreenHeader } from '@/components';
import { usePlan } from '@/state/plans';
import { space } from '@/theme';

// TEST ONLY (Settings → Demo): the plan sheet from the map with option A or B for "Going / Spots / Language".
// The map keeps the current boxes until the owner chooses.
export default function PlanSheetLook() {
  const { v } = useLocalSearchParams<{ v?: string }>();
  const look = v === 'B' ? 'B' : 'A';
  const plan = usePlan('sunset-drinks');
  return (
    <Screen
      scroll
      header={<ScreenHeader eyebrow="Demo · compare" title={`Plan sheet - ${look}`} />}
      contentStyle={styles.content}
    >
      {plan && <PlanSheet plan={plan} factsLook={look} />}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: space.xl, paddingBottom: space.xl },
});
