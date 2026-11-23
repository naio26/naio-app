import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { planWhen } from '@/data/time';
import { Plan } from '@/data/types';
import { usePeople } from '@/state/people';
import { usePlans } from '@/state/plans';
import { colors, fonts, space } from '@/theme';
import { Icon } from './Icon';
import { AvatarStack, PlanActions, PlanBadge, PointNote } from './PlanBits';
import { Txt } from './Txt';

/** Screen 26 — a plan tapped on the map (bottom sheet content). */
export function PlanSheet({ plan }: { plan: Plan }) {
  const { statusOf, membersOf } = usePlans();
  const status = statusOf(plan);
  const memberIds = membersOf(plan);
  const members = usePeople(memberIds);
  const host = members.find((m) => m.id === plan.hostId);
  const left = Math.max(plan.capacity - memberIds.length, 0);
  const spots = left ? `${left} ${left === 1 ? 'spot' : 'spots'} left` : 'Full';

  return (
    <View style={{ gap: space.lg }}>
      <View style={{ gap: 6 }}>
        <PlanBadge status={status} />
        {/* More room between the day/time and the title. */}
        <Txt variant="eyebrow" style={{ letterSpacing: 1.2, marginBottom: 6 }}>
          {planWhen(plan)}
        </Txt>
        <Txt variant="h1">{plan.title}</Txt>
        <Txt style={styles.place}>
          {plan.area} · {plan.distanceKm} km
        </Txt>
        <PointNote plan={plan} status={status} />
        <Txt style={{ marginTop: 6 }}>{plan.tagline}</Txt>
      </View>

      {/* Option B (chosen by the owner): two quiet lines with a thin icon, no boxes; then the people. */}
      <View style={{ gap: 10 }}>
        <View style={styles.iconLine}>
          <Icon name="user" color={colors.muted} />
          <Txt style={styles.lineText}>
            <Txt style={styles.bold}>{memberIds.length} going</Txt>
            <Txt style={styles.lineMuted}> · {spots}</Txt>
          </Txt>
        </View>
        <View style={styles.iconLine}>
          <Icon name="message-circle" color={colors.muted} />
          <Txt style={styles.lineText}>{plan.language}</Txt>
        </View>
        <AvatarStack people={members} hostId={plan.hostId} />
      </View>

      <PlanActions
        plan={plan}
        status={status}
        host={host}
        going={memberIds.length}
        secondary={{
          title: 'View details',
          onPress: () => router.push({ pathname: '/plan/[id]', params: { id: plan.id } }),
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  place: { fontFamily: fonts.sans, fontSize: 14.5, lineHeight: 20, color: colors.accent },
  lineText: { flex: 1, fontFamily: fonts.sans, fontSize: 15, lineHeight: 21, color: colors.dark },
  lineMuted: { fontFamily: fonts.sans, color: colors.muted },
  bold: { fontFamily: fonts.sansBold, color: colors.dark },
  iconLine: { flexDirection: 'row', alignItems: 'center', gap: 10 },
});
