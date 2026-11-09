import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { BackButton, Button, Screen, Txt } from '@/components';
import { usePlan, usePlans } from '@/state/plans';
import { space } from '@/theme';

// Screen 33 — are you sure?
export default function CancelPlan() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const plan = usePlan(id);
  const { cancelPlan } = usePlans();
  const [busy, setBusy] = useState(false);
  if (!plan) return <Screen>{null}</Screen>;

  const confirm = async () => {
    setBusy(true);
    await cancelPlan(id);
    router.replace({ pathname: '/plan/[id]/cancelled', params: { id } });
  };

  return (
    <Screen
      contentStyle={styles.content}
      footer={
        <View style={{ gap: 10 }}>
          <Button title="Yes, cancel plan" variant="danger" loading={busy} onPress={confirm} />
          <Button title="Keep plan" variant="outline" onPress={() => router.back()} />
        </View>
      }
    >
      <View>
        <BackButton />
      </View>
      <View style={styles.bottom}>
        <Txt variant="eyebrow" style={{ letterSpacing: 1.4 }}>
          Cancel plan
        </Txt>
        <Txt variant="h1">Cancel {plan.title}</Txt>
        <Txt>Everyone who joined will be notified. The chat and exact meeting point will no longer be available.</Txt>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: space.lg },
  bottom: { flex: 1, justifyContent: 'flex-end', gap: 16, paddingBottom: space.xl },
});
