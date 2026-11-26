import { useState } from 'react';
import { areaText } from '@/data/catalog';
import { StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BackButton, Button, Card, PersonSummary, Screen, Txt } from '@/components';
import { planWhen } from '@/data/time';
import { useCity } from '@/state/city';
import { usePeople } from '@/state/people';
import { usePlans } from '@/state/plans';
import { colors, fonts, radius, space } from '@/theme';

// Screens 40–41 — someone wants to join your plan. Look at their profile, then accept or decline.
export default function JoinRequestScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { requests, plans, answerRequest, membersOf } = usePlans();
  const request = requests.find((r) => r.id === id);
  const plan = plans.find((p) => p.id === request?.planId);
  const [person] = usePeople(request ? [request.personId] : []);
  const [busy, setBusy] = useState<'accept' | 'decline' | null>(null);
  const city = useCity();

  if (!request || !plan || !person) {
    return (
      <Screen contentStyle={{ paddingTop: space.lg, gap: space.lg }}>
        <BackButton />
        <Txt>This request is no longer available.</Txt>
      </Screen>
    );
  }

  const full = membersOf(plan).length >= plan.capacity;
  const answer = async (accept: boolean) => {
    setBusy(accept ? 'accept' : 'decline');
    await answerRequest(request.id, accept);
    setBusy(null);
  };
  const pill = { pending: 'New request', accepted: 'Accepted', declined: 'Declined' }[request.status];

  return (
    <Screen scroll edges={['bottom']} contentStyle={[styles.content, { paddingTop: insets.top + 12 }]}>
      <BackButton />
      {/* Their profile in the same style as the "open to plans" card. No flags. */}
      <PersonSummary
        person={person}
        eyebrow={pill}
        eyebrowColor={request.status === 'accepted' ? colors.green : colors.accent}
      />

      <Card style={styles.card}>
        <Txt style={styles.label}>Wants to join</Txt>
        <Txt variant="h2">{plan.title}</Txt>
        <Txt variant="small" color={colors.dark} style={{ fontSize: 15 }}>
          {planWhen(plan)} · {areaText(plan.area, city.name)}
        </Txt>
      </Card>

      {request.status === 'pending' && (
        <View style={{ gap: 10 }}>
          {full && (
            <Txt variant="caption" center>
              Your plan is full. Add spots with “Edit plan” to accept {person.firstName}.
            </Txt>
          )}
          <View style={styles.buttons}>
            <Button
              title="Decline"
              variant="outline"
              loading={busy === 'decline'}
              onPress={() => answer(false)}
              style={{ flex: 1 }}
            />
            <Button
              title="Accept"
              disabled={full}
              loading={busy === 'accept'}
              onPress={() => answer(true)}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      )}

      {request.status === 'accepted' && (
        <>
          <View style={styles.accepted}>
            <Txt color={colors.green}>{person.firstName} has been accepted. The temporary chat is now open.</Txt>
          </View>
          <Button
            title="Open temporary chat"
            variant="link"
            onPress={() => router.push({ pathname: '/plan/[id]/chat', params: { id: plan.id } })}
          />
        </>
      )}

      {request.status === 'declined' && (
        <Card tone="muted">
          <Txt>{person.firstName} has been declined. They’re told privately, without a reason.</Txt>
        </Card>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: space.xl, gap: space.xl },
  card: { padding: 22, gap: 6 },
  label: { fontFamily: fonts.sans, fontSize: 12, letterSpacing: 1.6, textTransform: 'uppercase', color: colors.muted },
  buttons: { flexDirection: 'row', gap: 12 },
  accepted: { backgroundColor: colors.greenSoft, borderRadius: radius.lg, padding: 20 },
});
