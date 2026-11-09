import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar, BackButton, Button, Card, Chip, Screen, Txt } from '@/components';
import { LANGUAGE_FLAGS } from '@/data/catalog';
import { planWhen } from '@/data/time';
import { usePeople } from '@/state/people';
import { usePlans } from '@/state/plans';
import { useProfile } from '@/state/profile';
import { colors, fonts, radius, space } from '@/theme';

// Screens 40–41 — someone wants to join your plan. Look at their profile, then accept or decline.
export default function JoinRequestScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { requests, plans, answerRequest, membersOf } = usePlans();
  const { profile } = useProfile();
  const request = requests.find((r) => r.id === id);
  const plan = plans.find((p) => p.id === request?.planId);
  const [person] = usePeople(request ? [request.personId] : []);
  const [busy, setBusy] = useState<'accept' | 'decline' | null>(null);

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
      <View style={styles.hero}>
        <Avatar initials={person.initials} size={150} color={person.avatarColor} verified={person.verified} serif />
        <View style={[styles.pill, request.status === 'accepted' && { backgroundColor: colors.greenSoft }]}>
          <Txt style={[styles.pillText, request.status === 'accepted' && { color: colors.green }]}>{pill}</Txt>
        </View>
        <Txt variant="display" center style={{ fontSize: 44, lineHeight: 50 }}>
          {person.firstName}, {person.ageRange}
        </Txt>
        <Txt center>{[person.situation, person.from && `From ${person.from}`].filter(Boolean).join(' · ')}</Txt>
      </View>

      <Card style={styles.card}>
        <View style={{ gap: 6 }}>
          <Txt style={styles.label}>Wants to join</Txt>
          <Txt variant="h2">{plan.title}</Txt>
          <Txt variant="small" color={colors.dark} style={{ fontSize: 15 }}>
            {planWhen(plan)} · {plan.area}
          </Txt>
        </View>
        {person.about && (
          <View style={{ gap: 4 }}>
            <Txt style={styles.label}>About {person.firstName}</Txt>
            <Txt color={colors.dark}>{person.about}</Txt>
          </View>
        )}
        <View style={{ gap: 4 }}>
          <Txt style={styles.label}>Languages</Txt>
          <Txt color={colors.dark}>
            {person.languages
              .map((l) => `${LANGUAGE_FLAGS[l.code] ? `${LANGUAGE_FLAGS[l.code]} ` : ''}${l.name}`)
              .join(' · ')}
          </Txt>
        </View>
        <View style={{ gap: 8 }}>
          <Txt style={styles.label}>Interests</Txt>
          <View style={styles.chips}>
            {/* Interests you share are highlighted. */}
            {person.interests.map((i) => (
              <Chip key={i} label={i} selected={profile.interests.includes(i)} />
            ))}
          </View>
        </View>
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
  hero: { alignItems: 'center', gap: 12, marginTop: -space.md },
  pill: {
    backgroundColor: colors.accentSoft,
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 8,
    marginTop: space.sm,
  },
  pillText: {
    fontFamily: fonts.sansBold,
    fontSize: 13,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: colors.accent,
  },
  card: { padding: 26, gap: 18, borderRadius: 28 },
  label: { fontFamily: fonts.sans, fontSize: 12, letterSpacing: 1.6, textTransform: 'uppercase', color: colors.muted },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  buttons: { flexDirection: 'row', gap: 12 },
  accepted: { backgroundColor: colors.greenSoft, borderRadius: radius.lg, padding: 20 },
});
