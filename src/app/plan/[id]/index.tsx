import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Avatar,
  BackButton,
  BottomSheet,
  GoingLine,
  HostingNote,
  InfoBox,
  PlanActions,
  PersonCard,
  PlanBadge,
  PointNote,
  Txt,
  VerifiedBadge,
} from '@/components';
import { languagesText } from '@/data/catalog';
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
  // Tap someone's circle in "Who's going": their short profile in a sheet.
  const [shownId, setShownId] = useState<string | null>(null);
  const shown = members.find((m) => m.id === shownId);
  if (!plan) return <View style={styles.root} />;

  const status = statusOf(plan);
  const host = members.find((m) => m.id === plan.hostId);
  const inside = status === 'accepted' || status === 'host';

  // No "Meet near" and no "Exact meeting point" row: the place (and, once you're in, the exact point) is under the title.
  const rows = [{ label: plan.languages.length > 1 ? 'Languages' : 'Language', value: languagesText(plan.languages) }];

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={{ paddingBottom: space.xl }} showsVerticalScrollIndicator={false}>
        <View style={[styles.band, inside && styles.bandIn, { paddingTop: insets.top + 12 }]}>
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
          {/* Once you're in: the description in italics (just the text, not as a note from the host). */}
          <Txt style={inside ? styles.descItalic : styles.desc}>{plan.description}</Txt>

          <View>
            {rows.map((r) => (
              <View key={r.label} style={styles.row}>
                <Txt style={styles.rowLabel}>{r.label}</Txt>
                <Txt style={styles.rowValue}>{r.value}</Txt>
              </View>
            ))}
            {/* "4 people" bold · "3 spots left" terracotta. No names: the initials below show who's going. */}
            <View style={styles.row}>
              <Txt style={styles.rowLabel}>Who’s going</Txt>
              <GoingLine people={members} hostId={plan.hostId} capacity={plan.capacity} names={false} />
            </View>
          </View>

          <View style={styles.people}>
            {members.map((m) => (
              <Pressable
                key={m.id}
                accessibilityRole="button"
                accessibilityLabel={`See ${m.id === 'me' ? 'your' : `${m.firstName}’s`} profile`}
                onPress={() => setShownId(m.id)}
                style={({ pressed }) => [styles.person, pressed && { opacity: 0.6 }]}
              >
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
                {m.id === plan.hostId && <Txt style={styles.host}>(HOST)</Txt>}
              </Pressable>
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

      <BottomSheet visible={!!shown} onClose={() => setShownId(null)} backdrop grabber={false}>
        {shown && <PersonCard person={shown} host={shown.id === plan.hostId} />}
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.cream },
  // Pale peach band while you're only looking; green once you're in the plan.
  band: { backgroundColor: colors.blush, paddingHorizontal: space.gutter, paddingBottom: space.xl },
  bandIn: { backgroundColor: colors.greenSoft },
  // The same space (24) above and below the description.
  body: { paddingHorizontal: space.gutter, paddingTop: space.xl, gap: space.xl },
  row: { gap: 8, paddingVertical: 16, borderTopWidth: 1, borderTopColor: colors.border },
  rowLabel: {
    fontFamily: fonts.sansBold,
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: colors.muted,
  },
  desc: { fontFamily: fonts.sans, fontSize: 15, lineHeight: 22, color: colors.dark },
  descItalic: { fontFamily: fonts.sansItalic, fontSize: 15, lineHeight: 22, color: colors.dark },
  // Titles in bold (above), the text under them in regular weight.
  rowValue: { fontFamily: fonts.sans, fontSize: 15, lineHeight: 22, color: colors.dark },
  people: { flexDirection: 'row', flexWrap: 'wrap', gap: 18 },
  person: { alignItems: 'center', gap: 6, minWidth: 56 },
  // Small "(HOST)" label under the host's initial.
  host: {
    fontFamily: fonts.sansBold,
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.accent,
    marginTop: -4,
  },
  footer: { paddingHorizontal: space.gutter, paddingTop: space.md, gap: space.sm, backgroundColor: colors.cream },
});
