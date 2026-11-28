import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { languagesText, placeText } from '@/data/catalog';
import { planWhen } from '@/data/time';
import { Plan } from '@/data/types';
import { useCity } from '@/state/city';
import { usePeople } from '@/state/people';
import { usePlans } from '@/state/plans';
import { colors, fonts, radius, space } from '@/theme';
import { Button } from './Button';
import { FitLanguages } from './FitLanguages';
import { Icon } from './Icon';
import { AvatarStack, PlanActions, PlanBadge, PointNote } from './PlanBits';
import { Txt } from './Txt';

/** Screen 26 — a plan tapped on the map (bottom sheet content). */
export function PlanSheet({ plan }: { plan: Plan }) {
  const city = useCity();
  const { statusOf, membersOf } = usePlans();
  const status = statusOf(plan);
  const memberIds = membersOf(plan);
  const members = usePeople(memberIds);
  const host = members.find((m) => m.id === plan.hostId);
  const going = memberIds.length;
  const left = Math.max(plan.capacity - going, 0);
  const spots = left ? `${left} ${left === 1 ? 'spot' : 'spots'} left` : 'Full';
  const inside = status === 'accepted' || status === 'host';
  // Your own plan: yellow dominates (golden text). Every other plan: the naio. terracotta.
  const mine = status === 'host';
  const tone = mine ? colors.mineInk : colors.accent;
  // A plan you're in: green day/time, "View details" link and group chat button (the rest as any plan).
  const joined = status === 'accepted';
  const details = () => router.push({ pathname: '/plan/[id]', params: { id: plan.id } });
  // The place in terracotta (golden on your plan) and, right under it, the exact-point note.
  const where = (
    <View style={{ gap: 2 }}>
      <Txt style={[styles.place, { color: tone }]}>{placeText(plan.area, city.name)}</Txt>
      {inside ? (
        // Once you're in: the exact point, tap it for directions.
        <PointNote plan={plan} status={status} arrowEnd />
      ) : (
        // Before joining: italic, in the same terracotta as the place, right under it.
        <View style={styles.noteLine}>
          <Icon name="map-pin" size={14} color={colors.accent} />
          <Txt style={styles.placeNote}>Exact point is shared after joining</Txt>
        </View>
      )}
    </View>
  );

  return (
    <View style={{ gap: space.lg }}>
      <View style={{ gap: 6 }}>
        <PlanBadge status={status} hosting />
        {/* More room between the day/time and the title. */}
        {/* Your own plan: golden. A plan you're in: green, like "You're in". */}
        <Txt variant="eyebrow" style={[{ letterSpacing: 1.2, marginBottom: 6 }, mine && { color: colors.mineInk }, joined && { color: colors.green }]}>
          {planWhen(plan)}
        </Txt>
        <Txt variant="h1">{plan.title}</Txt>
        {/* The description right under the title, the same size as on plan details. */}
        <Txt style={styles.desc}>{plan.tagline}</Txt>
      </View>

      {/* Owner's choice: divider, then the place in terracotta with the exact-point note right under it. */}
      <View style={styles.placeBlock}>{where}</View>

      {/* The owner's choice: the box "3/7 going · 4 spots left", and the language on the right (thin icon, no box). */}
      <View style={styles.factsRow}>
        <View style={styles.box}>
          <Txt style={styles.boxText}>
            <Txt style={[styles.boxText, styles.bold]}>
              {going}/{plan.capacity} going
            </Txt>
            <Txt style={[styles.boxText, { color: tone }]}> · {spots}</Txt>
          </Txt>
        </View>
        <View style={styles.lang}>
          <Icon name="message-circle" size={16} color={colors.muted} />
          {/* As many languages as fit on one line, then "+N" (the full list is on plan details). */}
          <FitLanguages languages={plan.languages} style={[styles.boxText, { color: colors.muted }]} />
        </View>
      </View>

      {/* Names in regular weight, no "(host)" here. Only in a plan you've joined (main button: the group chat),
          a green "View details" link on the right (tap each person there); otherwise the button below does it. */}
      <View style={styles.peopleRow}>
        <View style={{ flex: 1 }}>
          <AvatarStack people={members} plain nameMax={2} meColor={mine ? colors.mineInk : colors.accent} />
        </View>
        {joined && (
          <Pressable accessibilityRole="link" hitSlop={10} onPress={details}>
            <Txt variant="caption" style={[styles.peopleLink, { color: colors.green }]}>
              View details
            </Txt>
          </Pressable>
        )}
      </View>

      {/* No "Join plan" here: you always see the details first. Once you're accepted: the group chat. */}
      {status === 'host' ? (
        <PlanActions
          plan={plan}
          status={status}
          host={host}
          going={going}
          hostingNote={false}
          secondary={{ title: 'View details', onPress: details }}
        />
      ) : status === 'accepted' ? (
        <Button
          title="Open the group chat"
          variant="green"
          arrow
          onPress={() => router.push({ pathname: '/plan/[id]/chat', params: { id: plan.id } })}
        />
      ) : (
        <Button title="View details" arrow onPress={details} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  place: { fontFamily: fonts.sans, fontSize: 14.5, lineHeight: 21, color: colors.accent },
  placeBlock: { paddingTop: space.lg, borderTopWidth: 1, borderTopColor: colors.border },
  desc: { fontSize: 15, lineHeight: 22 },
  peopleRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  peopleLink: { fontFamily: fonts.sansBold, textDecorationLine: 'underline' },
  noteLine: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  placeNote: { fontFamily: fonts.sansItalic, fontSize: 13, lineHeight: 18, color: colors.accent, flexShrink: 1 },
  bold: { fontFamily: fonts.sansBold, color: colors.dark },
  factsRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  box: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    justifyContent: 'center',
  },
  boxText: { fontFamily: fonts.sans, fontSize: 14, lineHeight: 19, color: colors.dark },
  lang: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 },
});
