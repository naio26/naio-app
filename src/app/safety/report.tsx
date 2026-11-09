import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Icon, type IconName } from '@/components';
import { Button, Chip, Input, Screen, ScreenHeader, Txt } from '@/components';
import { listEveryone, sendReport } from '@/data/api';
import { REPORT_REASONS } from '@/data/catalog';
import { useLoad } from '@/data/hooks';
import { usePlans } from '@/state/plans';
import { useSafety } from '@/state/safety';
import { colors, icon, space } from '@/theme';

type Target = { kind: 'person' | 'plan'; id: string; name: string };

// Report a person or plan (from the Safety centre). Fake: nothing is sent anywhere.
export default function Report() {
  const everyone = useLoad(listEveryone, []) ?? [];
  const { plans } = usePlans();
  const { blocked, block } = useSafety();
  const [target, setTarget] = useState<Target | null>(null);
  const [reason, setReason] = useState<string | null>(null);
  const [details, setDetails] = useState('');
  const [state, setState] = useState<'form' | 'sending' | 'sent'>('form');

  const send = async () => {
    if (!target || !reason) return;
    setState('sending');
    await sendReport({
      personId: target.kind === 'person' ? target.id : undefined,
      planId: target.kind === 'plan' ? target.id : undefined,
      reason,
      details,
    });
    setState('sent');
  };

  if (state === 'sent' && target) {
    const canBlock = target.kind === 'person' && !blocked.includes(target.id);
    return (
      <Screen
        contentStyle={styles.done}
        footer={
          <View style={{ gap: 10 }}>
            {canBlock && (
              <Button title={`Also block ${target.name}`} variant="outline" onPress={() => block(target.id)} />
            )}
            <Button title="Done" arrow onPress={() => router.back()} />
          </View>
        }
      >
        <View style={{ marginBottom: space.sm }}>
          <Icon name="check" size={icon.hero} color={colors.accent} />
        </View>
        <Txt variant="display" center style={{ fontSize: 38 }}>
          Thanks for telling us.
        </Txt>
        <Txt center>
          We review every report privately.{' '}
          {target.kind === 'person' ? `${target.name} won’t know it was you.` : 'The host won’t know it was you.'}
        </Txt>
      </Screen>
    );
  }

  return (
    <Screen
      scroll
      header={<ScreenHeader eyebrow="Private and reviewed" title="Report" />}
      contentStyle={{ paddingTop: space.xl, paddingBottom: space.xl, gap: space.xl }}
      footer={
        <Button title="Send report" arrow disabled={!target || !reason} loading={state === 'sending'} onPress={send} />
      }
    >
      <View style={styles.block}>
        <Txt variant="question">Who or what?</Txt>
        <Txt variant="caption">People</Txt>
        <View style={styles.chips}>
          {everyone.map((p) => (
            <Chip
              key={p.id}
              size="sm"
              label={p.firstName}
              selected={target?.id === p.id}
              onPress={() => setTarget({ kind: 'person', id: p.id, name: p.firstName })}
            />
          ))}
        </View>
        <Txt variant="caption">Plans</Txt>
        <View style={styles.chips}>
          {plans
            .filter((p) => p.hostId !== 'me')
            .map((p) => (
              <Chip
                key={p.id}
                size="sm"
                label={p.title}
                selected={target?.id === p.id}
                onPress={() => setTarget({ kind: 'plan', id: p.id, name: p.title })}
              />
            ))}
        </View>
      </View>
      <View style={styles.block}>
        <Txt variant="question">What happened?</Txt>
        <View style={styles.chips}>
          {REPORT_REASONS.map((r) => (
            <Chip key={r} size="sm" label={r} selected={reason === r} onPress={() => setReason(r)} />
          ))}
        </View>
      </View>
      <View style={styles.block}>
        <Txt variant="question">Anything else? (optional)</Txt>
        <Input
          placeholder="Tell us what happened, in your own words."
          value={details}
          onChangeText={setDetails}
          multiline
          maxLength={500}
          style={{ height: 110, paddingTop: 14, textAlignVertical: 'top' }}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  block: { gap: 12 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  done: { justifyContent: 'center', alignItems: 'center', gap: 16 },
});
