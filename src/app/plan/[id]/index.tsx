import { ScrollView, StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar, BackButton, HostingNote, InfoBox, MeetingPoint, PlanActions, PlanBadge, Txt } from '@/components';
import { planWhen } from '@/data/time';
import { usePeople } from '@/state/people';
import { usePlan, usePlans } from '@/state/plans';
import { colors, fonts, space } from '@/theme';

// Screen 27 — plan details.
export default function PlanDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const plan = usePlan(id);
  const { statusOf, membersOf } = usePlans();
  const memberIds = plan ? membersOf(plan) : [];
  const members = usePeople(memberIds);
  if (!plan) return <View style={styles.root} />;

  const status = statusOf(plan);
  const host = members.find((m) => m.id === plan.hostId);
  const left = Math.max(plan.capacity - memberIds.length, 0);
  const inside = status === 'accepted' || status === 'host';

  const rows = [
    inside
      ? { label: 'Exact meeting point', value: `${plan.exactPoint} · ${plan.distanceKm} km` }
      : { label: 'Meet near', value: `${plan.meetNear} · ${plan.distanceKm} km` },
    { label: 'Language', value: plan.language },
    {
      label: 'Who is going',
      value: `${memberIds.length} ${memberIds.length === 1 ? 'person' : 'people'} · ${left ? `${left} ${left === 1 ? 'spot' : 'spots'} left` : 'full'}`,
    },
  ];

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={{ paddingBottom: space.xl }} showsVerticalScrollIndicator={false}>
        <View style={[styles.band, { paddingTop: insets.top + 12 }]}>
          <BackButton />
          <View style={{ marginTop: space.xl, gap: 8 }}>
            <PlanBadge status={status} />
            <Txt variant="eyebrow" style={{ letterSpacing: 1.2 }}>
              {planWhen(plan)}
            </Txt>
            <Txt variant="display" style={{ fontSize: 38, lineHeight: 44 }}>
              {plan.title}
            </Txt>
            <Txt>
              {plan.area} · {plan.distanceKm} km
            </Txt>
          </View>
        </View>

        <View style={styles.body}>
          <Txt style={{ fontSize: 17, lineHeight: 25 }}>{plan.description}</Txt>

          <View style={{ marginTop: space.lg }}>
            {rows.map((r) => (
              <View key={r.label} style={styles.row}>
                <Txt style={styles.rowLabel}>{r.label}</Txt>
                <Txt variant="bodyStrong">{r.value}</Txt>
              </View>
            ))}
          </View>

          <View style={styles.people}>
            {members.map((m) => (
              <View key={m.id} style={styles.person}>
                <Avatar
                  initials={m.initials}
                  size={52}
                  color={m.id === 'me' ? colors.accent : m.avatarColor}
                  verified={m.verified}
                />
                <Txt variant="label" style={{ fontSize: 14 }}>
                  {m.id === 'me' ? 'You' : m.firstName}
                </Txt>
                {m.id === plan.hostId && <Txt style={styles.host}>Host</Txt>}
              </View>
            ))}
          </View>

          <MeetingPoint plan={plan} status={status} />
          {status === 'host' && <HostingNote />}
          {status === 'requested' && (
            <InfoBox
              title="Waiting for the host"
              text={`${host?.firstName ?? 'The host'} has your request. Once accepted, the group chat and the exact meeting point unlock.`}
            />
          )}
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + space.sm }]}>
        <PlanActions plan={plan} status={status} host={host} going={memberIds.length} hostingNote={false} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.cream },
  band: { backgroundColor: colors.blush, paddingHorizontal: space.gutter, paddingBottom: space.xl + 4 },
  body: { paddingHorizontal: space.gutter, paddingTop: space.xl, gap: space.lg },
  row: { gap: 8, paddingVertical: 16, borderTopWidth: 1, borderTopColor: colors.border },
  rowLabel: {
    fontFamily: fonts.sansBold,
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: colors.muted,
  },
  people: { flexDirection: 'row', flexWrap: 'wrap', gap: 18 },
  person: { alignItems: 'center', gap: 6, minWidth: 56 },
  host: {
    fontFamily: fonts.sansBold,
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.accent,
    marginTop: -4,
  },
  footer: { paddingHorizontal: space.gutter, paddingTop: space.md, backgroundColor: colors.cream },
});
