import { router, useLocalSearchParams } from 'expo-router';
import { Button, ResultScreen, Screen } from '@/components';
import { formatTime } from '@/data/time';
import { usePlan } from '@/state/plans';

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
      lines={[`${plan.day === 'today' ? 'Today' : 'Tomorrow'} · ${formatTime(plan.time)}`, plan.exactPoint]}
      note="The people who joined have been notified."
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
