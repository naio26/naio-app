import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { planWhen } from '@/data/time';
import { Plan } from '@/data/types';
import { useCity } from '@/state/city';
import { usePeople } from '@/state/people';
import { usePlans } from '@/state/plans';
import { colors, fonts, radius, space } from '@/theme';
import { Button } from './Button';
import { Icon } from './Icon';
import { AvatarStack, PlanActions, PlanBadge } from './PlanBits';
import { Txt } from './Txt';

/**
 * How "going / spots / language" look on the sheet. 'lines' = the current two icon lines.
 * 'A' (two boxes) and 'B' (seat dots) are test versions, only from Settings → Demo until the owner chooses.
 */
export type FactsLook = 'lines' | 'A' | 'B';

/** Screen 26 — a plan tapped on the map (bottom sheet content). */
export function PlanSheet({ plan, factsLook = 'lines' }: { plan: Plan; factsLook?: FactsLook }) {
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
        <Txt variant="eyebrow" style={{ letterSpacing: 1.2, marginBottom: 6 }}>
          {planWhen(plan)}
        </Txt>
        <Txt variant="h1">{plan.title}</Txt>
        {/* One terracotta line: "Psyrri, Athens (📍 Exact point is shared after joining)". */}
        <Txt style={styles.place}>
          {plan.area}, {city.name}{' '}
          <Txt style={styles.placeNote}>
            (<Icon name="map-pin" size={12} color={colors.accent} />{' '}
            {inside ? plan.exactPoint : 'Exact point is shared after joining'})
          </Txt>
        </Txt>
        <Txt style={{ marginTop: 6 }}>{plan.tagline}</Txt>
      </View>

      {factsLook === 'A' ? (
        // A · two boxes side by side: "3/7 going · 4 spots left" and the language.
        <View style={styles.boxes}>
          <View style={[styles.box, { flex: 1.6 }]}>
            <Txt style={styles.boxText}>
              <Txt style={[styles.boxText, styles.bold]}>
                {going}/{plan.capacity} going
              </Txt>
              <Txt style={[styles.boxText, { color: colors.accent }]}> · {spots}</Txt>
            </Txt>
          </View>
          <View style={[styles.box, { flex: 1 }]}>
            <Txt style={styles.boxText}>{plan.language}</Txt>
          </View>
        </View>
      ) : factsLook === 'B' ? (
        // B · one clean row: a dot per spot (filled = taken), "4 spots left", and the language on the right.
        <View style={styles.seatRow}>
          <View style={styles.seats}>
            {Array.from({ length: plan.capacity }, (_, i) => (
              <View key={i} style={[styles.seat, i < going && styles.seatTaken]} />
            ))}
          </View>
          <Txt style={[styles.lineText, { color: colors.accent }]}>{spots}</Txt>
          <View style={styles.lang}>
            <Icon name="message-circle" size={16} color={colors.muted} />
            <Txt style={styles.lineMuted}>{plan.language}</Txt>
          </View>
        </View>
      ) : (
        // Current: two quiet lines with a thin icon.
        <View style={{ gap: 10 }}>
          <View style={styles.iconLine}>
            <Icon name="user" color={colors.muted} />
            <Txt style={styles.lineText}>
              <Txt style={[styles.lineText, styles.bold]}>{going} going</Txt>
              <Txt style={[styles.lineText, styles.lineMuted]}> · {spots}</Txt>
            </Txt>
          </View>
          <View style={styles.iconLine}>
            <Icon name="message-circle" color={colors.muted} />
            <Txt style={styles.lineText}>{plan.language}</Txt>
          </View>
        </View>
      )}

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
  placeNote: { fontFamily: fonts.sans, fontSize: 12.5, lineHeight: 21, color: colors.accent },
  lineText: { fontFamily: fonts.sans, fontSize: 15, lineHeight: 21, color: colors.dark },
  lineMuted: { fontFamily: fonts.sans, fontSize: 15, lineHeight: 21, color: colors.muted },
  bold: { fontFamily: fonts.sansBold, color: colors.dark },
  iconLine: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  boxes: { flexDirection: 'row', gap: 10 },
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
  seatRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  seats: { flexDirection: 'row', gap: 4 },
  seat: { width: 10, height: 10, borderRadius: 5, borderWidth: 1.5, borderColor: colors.accentLine },
  seatTaken: { backgroundColor: colors.accentFill, borderColor: colors.accentFill },
  lang: { marginLeft: 'auto', flexDirection: 'row', alignItems: 'center', gap: 6 },
});
