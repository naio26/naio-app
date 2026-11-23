import { ScrollView, StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Avatar,
  BackButton,
  GoingLine,
  HostingNote,
  InfoBox,
  PlanActions,
  PlanBadge,
  PointNote,
  Txt,
  VerifiedBadge,
} from '@/components';
import { planWhen } from '@/data/time';
import { usePeople } from '@/state/people';
import { usePlan, usePlans } from '@/state/plans';
import { colors, fonts, space } from '@/theme';

// Screen 27 — plan details.
export default function PlanDetails() {
  // ?desc=A|B: test versions of the description, only from Settings → Demo until the owner chooses.
  const { id, desc } = useLocalSearchParams<{ id: string; desc?: string }>();
  const insets = useSafeAreaInsets();
  const plan = usePlan(id);
  const { statusOf, membersOf } = usePlans();
  const memberIds = plan ? membersOf(plan) : [];
  const members = usePeople(memberIds);
  if (!plan) return <View style={styles.root} />;

  const status = statusOf(plan);
  const host = members.find((m) => m.id === plan.hostId);
  const inside = status === 'accepted' || status === 'host';

  const rows = [
    inside
      ? { label: 'Exact meeting point', value: `${plan.exactPoint} · ${plan.distanceKm} km` }
      : { label: 'Meet near', value: `${plan.meetNear} · ${plan.distanceKm} km` },
    { label: 'Language', value: plan.language },
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
            <PointNote plan={plan} status={status} />
          </View>
        </View>

        <View style={styles.body}>
          {desc === 'A' ? (
            // A · soft box: a small bold title and the text in a light butter box.
            <View style={styles.descBox}>
              <Txt style={styles.rowLabel}>About this plan</Txt>
              <Txt style={styles.rowValue}>{plan.description}</Txt>
            </View>
          ) : desc === 'B' ? (
            // B · from the host: their initial, "Sofia says", the text in italics with a thin terracotta line.
            <View style={styles.descHost}>
              {host && (
                <Avatar
                  initials={host.initials}
                  size={32}
                  color={host.id === 'me' ? colors.accent : host.avatarColor}
                  photo={host.photo}
                />
              )}
              <View style={styles.descQuote}>
                <Txt variant="caption">{host?.id === 'me' ? 'You said' : `${host?.firstName ?? 'The host'} says`}</Txt>
                <Txt style={styles.descItalic}>{plan.description}</Txt>
              </View>
            </View>
          ) : (
            <Txt style={{ fontSize: 15, lineHeight: 22 }}>{plan.description}</Txt>
          )}

          <View style={{ marginTop: space.lg }}>
            {rows.map((r) => (
              <View key={r.label} style={styles.row}>
                <Txt style={styles.rowLabel}>{r.label}</Txt>
                <Txt style={styles.rowValue}>{r.value}</Txt>
              </View>
            ))}
            {/* "4 people" bold · "3 spots left" terracotta, then the names: "Maya (host), Leo". */}
            <View style={styles.row}>
              <Txt style={styles.rowLabel}>Who’s going</Txt>
              <GoingLine people={members} hostId={plan.hostId} capacity={plan.capacity} />
            </View>
          </View>

          <View style={styles.people}>
            {members.map((m) => (
              <View key={m.id} style={styles.person}>
                <Avatar
                  initials={m.initials}
                  size={52}
                  color={m.id === 'me' ? colors.accent : m.avatarColor}
                  verified={m.verified}
                  photo={m.photo}
                />
                <Txt variant="label" style={{ fontSize: 14 }}>
                  {m.id === 'me' ? 'You' : m.firstName}
                </Txt>
                <Txt variant="caption">{m.ageRange}</Txt>
                {m.id === plan.hostId && <Txt style={styles.host}>(host)</Txt>}
              </View>
            ))}
          </View>

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
        {status !== 'host' && <VerifiedBadge />}
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
  descBox: { gap: 8, padding: 18, borderRadius: 18, backgroundColor: colors.mist },
  descHost: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  descQuote: { flex: 1, gap: 4, paddingLeft: 12, borderLeftWidth: 2, borderLeftColor: colors.accentLine },
  descItalic: { fontFamily: fonts.sansItalic, fontSize: 15, lineHeight: 22, color: colors.dark },
  // Titles in bold (above), the text under them in regular weight.
  rowValue: { fontFamily: fonts.sans, fontSize: 15, lineHeight: 22, color: colors.dark },
  people: { flexDirection: 'row', flexWrap: 'wrap', gap: 18 },
  person: { alignItems: 'center', gap: 6, minWidth: 56 },
  host: { fontFamily: fonts.sans, fontSize: 12, color: colors.accent, marginTop: -4 },
  footer: { paddingHorizontal: space.gutter, paddingTop: space.md, gap: space.sm, backgroundColor: colors.cream },
});
