import { router, useLocalSearchParams } from 'expo-router';
import { Button, ResultScreen, Screen } from '@/components';
import { formatTime } from '@/data/time';
import { usePlan } from '@/state/plans';

// Screen 30 — your plan is live.
export default function PlanPosted() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const plan = usePlan(id);
  if (!plan) return <Screen>{null}</Screen>;
  return (
    <ResultScreen
      icon="check"
      title="Plan posted."
      cardTitle={plan.title}
      lines={[`${plan.day === 'today' ? 'Today' : 'Tomorrow'} · ${formatTime(plan.time)}`, plan.exactPoint]}
      note="People nearby whose filters match can now find it."
      footer={
        <Button title="View my plan" arrow onPress={() => router.replace({ pathname: '/plan/[id]', params: { id } })} />
      }
    />
  );
}
