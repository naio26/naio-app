import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { languagesText, placeText } from '@/data/catalog';
import { planWhen } from '@/data/time';
import { Plan } from '@/data/types';
import { useCity } from '@/state/city';
import { usePeople } from '@/state/people';
import { usePlans } from '@/state/plans';
import { colors, fonts, radius, space } from '@/theme';
import { Button } from './Button';
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
  const details = () => router.push({ pathname: '/plan/[id]', params: { id: plan.id } });

  return (
    <View style={{ gap: space.lg }}>
      <View style={{ gap: 6 }}>
        <PlanBadge status={status} />
        {/* More room between the day/time and the title. */}
        {/* In the plan ("You're in"): day and time in the same green. */}
        <Txt variant="eyebrow" style={[{ letterSpacing: 1.2, marginBottom: 6 }, status === 'accepted' && { color: colors.green }, status === 'host' && { color: colors.mineInk }]}>
          {planWhen(plan)}
        </Txt>
        <Txt variant="h1">{plan.title}</Txt>
        {/* The description right under the title. */}
        <Txt>{plan.tagline}</Txt>
      </View>

      {/* Divider, then the place in terracotta with the exact-point note on its own line below. */}
      <View style={styles.placeBlock}>
        <Txt style={styles.place}>{placeText(plan.area, city.name)}</Txt>
        {inside ? (
          // Once you're in: the exact point in green, tap it for directions.
          <PointNote plan={plan} status={status} />
        ) : (
          // Before joining: italic, in the dark text colour.
          <View style={styles.noteLine}>
            <Icon name="map-pin" size={14} color={colors.dark} />
            <Txt style={styles.placeNote}>Exact point is shared after joining</Txt>
          </View>
        )}
      </View>

      {/* The owner's choice: the box "3/7 going · 4 spots left", and the language on the right (thin icon, no box). */}
      <View style={styles.factsRow}>
        <View style={styles.box}>
          <Txt style={styles.boxText}>
            <Txt style={[styles.boxText, styles.bold]}>
              {going}/{plan.capacity} going
            </Txt>
            <Txt style={[styles.boxText, { color: colors.accent }]}> · {spots}</Txt>
          </Txt>
        </View>
        <View style={styles.lang}>
          <Icon name="message-circle" size={16} color={colors.muted} />
          <Txt style={[styles.boxText, { color: colors.muted }]}>{languagesText(plan.languages)}</Txt>
        </View>
      </View>

      {/* Names in regular weight, no "(host)" here. */}
      <AvatarStack people={members} plain />

      {/* No "Join plan" here: you always see the details first. Once you're accepted: the group chat. */}
      {status === 'host' ? (
        <PlanActions
          plan={plan}
          status={status}
          host={host}
          going={going}
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
  placeBlock: { gap: 6, paddingTop: space.lg, borderTopWidth: 1, borderTopColor: colors.border },
  noteLine: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  placeNote: { fontFamily: fonts.sansItalic, fontSize: 13, lineHeight: 18, color: colors.dark, flexShrink: 1 },
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
  lang: { flexShrink: 1, flexDirection: 'row', alignItems: 'center', gap: 6 },
});
