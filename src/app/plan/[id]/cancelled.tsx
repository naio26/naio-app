import { router, useLocalSearchParams } from 'expo-router';
import { Button, ResultScreen, Screen } from '@/components';
import { planWhen } from '@/data/time';
import { usePlan } from '@/state/plans';
import { colors } from '@/theme';

// Screen 34 — the plan is gone.
export default function PlanCancelled() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const plan = usePlan(id);
  if (!plan) return <Screen>{null}</Screen>;
  return (
    <ResultScreen
      icon="x"
      title="Plan cancelled."
      cardTitle={plan.title}
      lines={[planWhen(plan), plan.exactPoint]}
      note="The people who joined have been notified."
      cardStyle={{ borderColor: colors.cancelLine, borderWidth: 1.5 }}
      footer={
        <Button
          title="Go to my plans"
          arrow
          onPress={() => {
            router.dismissAll();
            router.replace('/plans');
          }}
        />
      }
    />
  );
}
