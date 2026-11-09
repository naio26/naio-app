import { router } from 'expo-router';
import { emptyDraft, PlanForm } from '@/components';
import { usePlans } from '@/state/plans';

// Screen 29 — opened by the big "+" in the tab bar.
export default function Create() {
  const { createPlan } = usePlans();
  return (
    <PlanForm
      title="Create a plan"
      initial={emptyDraft()}
      submitLabel="Post plan"
      onSubmit={async (d) => {
        const plan = await createPlan(d);
        router.replace({ pathname: '/plan/[id]/posted', params: { id: plan.id } });
      }}
    />
  );
}
