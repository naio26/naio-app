import { router, useLocalSearchParams } from 'expo-router';
import { draftFromPlan, PlanForm, Screen } from '@/components';
import { usePlan, usePlans } from '@/state/plans';

// Screen 32 — change your plan.
export default function EditPlan() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const plan = usePlan(id);
  const { updatePlan, membersOf } = usePlans();
  if (!plan) return <Screen>{null}</Screen>;
  return (
    <PlanForm
      title="Edit plan"
      initial={draftFromPlan(plan)}
      submitLabel="Save changes"
      minSpots={membersOf(plan).length - 1}
      onSubmit={async (d) => {
        await updatePlan(id, d);
        router.back();
      }}
    />
  );
}
