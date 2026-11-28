import { useState } from 'react';
import { View } from 'react-native';
import { planWhen } from '@/data/time';
import { Plan } from '@/data/types';
import { usePlans } from '@/state/plans';
import { colors, space } from '@/theme';
import { BottomSheet } from './BottomSheet';
import { Button } from './Button';
import { Txt } from './Txt';

/**
 * A new plan (joining one, posting or saving yours) happens at the same time as a plan you're already in,
 * hosting or asked to join. It never goes ahead directly: you choose to keep your current plan, or to
 * leave / cancel it and go ahead with the new one.
 */
export function OverlapChoice({
  clash,
  action,
  onClose,
  onContinue,
}: {
  /** The plan it overlaps with (null = sheet closed). */
  clash: Plan | null;
  action: 'join' | 'post' | 'save';
  onClose: () => void;
  /** Called after the current plan was left / cancelled. */
  onContinue: () => Promise<void> | void;
}) {
  const { statusOf, leavePlan, cancelRequest, cancelPlan } = usePlans();
  const [busy, setBusy] = useState(false);
  const status = clash ? statusOf(clash) : 'none';
  const verb = action === 'join' ? 'join this one' : action === 'post' ? 'post this one' : 'save this one';
  const drop =
    status === 'host'
      ? `Cancel my plan and ${verb}`
      : status === 'requested'
        ? `Cancel my request and ${verb}`
        : `Leave it and ${verb}`;

  const go = async () => {
    if (!clash) return;
    setBusy(true);
    if (status === 'host') await cancelPlan(clash.id);
    else if (status === 'requested') await cancelRequest(clash.id);
    else await leavePlan(clash.id);
    onClose();
    await onContinue();
    setBusy(false);
  };

  return (
    <BottomSheet visible={!!clash} onClose={onClose} backdrop>
      {clash && (
        <View style={{ gap: space.lg }}>
          <View style={{ gap: 8 }}>
            <Txt variant="h1">It overlaps with another plan</Txt>
            <Txt>
              {status === 'host' ? 'Your plan' : status === 'requested' ? 'You asked to join' : 'You’re in'} “
              {clash.title}”
            </Txt>
            <Txt variant="label" color={colors.accent}>
              {planWhen(clash)}
            </Txt>
          </View>
          <View style={{ gap: 10 }}>
            <Button
              title={action === 'join' ? 'Keep my plan' : 'Keep my current plan'}
              variant="outline"
              onPress={onClose}
            />
            <Button title={drop} loading={busy} onPress={go} />
          </View>
        </View>
      )}
    </BottomSheet>
  );
}
