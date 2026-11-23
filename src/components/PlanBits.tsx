import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Icon, type IconName } from './Icon';
import { Plan, Person } from '@/data/types';
import { MyStatus, usePlans } from '@/state/plans';
import { colors, fonts, radius, space } from '@/theme';
import { Avatar } from './Avatar';
import { Button } from './Button';
import { Txt } from './Txt';

/** Overlapping initials + "Maya, Leo, Nora +1". */
export function AvatarStack({ people, max = 3, hostId }: { people: Person[]; max?: number; hostId?: string }) {
  const shown = people.slice(0, max);
  const extra = people.length - shown.length;
  const names = goingNames(shown, hostId ?? '') + (extra > 0 ? ` +${extra}` : '');
  return (
    <View style={styles.stackRow}>
      <View style={styles.stack}>
        {shown.map((p, i) => (
          <View key={p.id} style={[styles.stackItem, { marginLeft: i === 0 ? 0 : -10, zIndex: max - i }]}>
            <Avatar
              initials={p.initials}
              size={34}
              color={p.id === 'me' ? colors.accent : p.avatarColor}
              photo={p.photo}
            />
          </View>
        ))}
        {extra > 0 && (
          <View style={[styles.stackItem, styles.more]}>
            <Txt style={styles.moreText}>+{extra}</Txt>
          </View>
        )}
      </View>
      <Txt variant="label" style={{ flex: 1 }}>
        {names}
      </Txt>
    </View>
  );
}

/** Names with the host in parentheses: "Maya (host), Leo, You". */
export const goingNames = (people: Person[], hostId: string) =>
  people.map((p) => `${p.id === 'me' ? 'You' : p.firstName}${p.id === hostId ? ' (host)' : ''}`).join(', ');

/**
 * "Who's going": "4 people" in bold · "3 spots left" in regular terracotta,
 * then the names below in the normal text colour ("Maya (host), Leo…").
 */
export function GoingLine({
  people,
  hostId,
  capacity,
  small,
}: {
  people: Person[];
  hostId: string;
  capacity: number;
  small?: boolean;
}) {
  const left = Math.max(capacity - people.length, 0);
  const size = small ? { fontSize: 13, lineHeight: 18 } : null;
  return (
    <View style={{ gap: 4 }}>
      <Txt style={[styles.goingCount, size]}>
        {people.length} {people.length === 1 ? 'person' : 'people'}
        <Txt style={styles.goingSpots}> · {left ? `${left} ${left === 1 ? 'spot' : 'spots'} left` : 'full'}</Txt>
      </Txt>
      <Txt style={[styles.goingNames, size]}>{goingNames(people, hostId)}</Txt>
    </View>
  );
}

/** Small line under the place, with a pin: "Exact point is shared after joining" (terracotta), or the exact point once you're in. */
export function PointNote({ plan, status }: { plan: Plan; status: MyStatus }) {
  const open = status === 'accepted' || status === 'host';
  const color = open ? colors.green : colors.accent;
  return (
    <View style={styles.pointNote}>
      <Icon name="map-pin" size={14} color={color} />
      <Txt variant="caption" color={color} style={{ flexShrink: 1 }}>
        {open ? `Exact point: ${plan.exactPoint}` : 'Exact point is shared after joining'}
      </Txt>
    </View>
  );
}

/** "Exact point is shared after joining" with a lock (or the point itself once you're in). */
export function MeetingPoint({ plan, status }: { plan: Plan; status: MyStatus }) {
  const open = status === 'accepted' || status === 'host';
  return (
    <View style={styles.point}>
      <Icon name={open ? 'map-pin' : 'lock'} color={open ? colors.green : colors.muted} />
      <Txt variant="small" color={open ? colors.green : colors.muted} style={{ flex: 1 }}>
        {open ? `Exact point: ${plan.exactPoint}` : 'Exact point is shared after joining'}
      </Txt>
    </View>
  );
}

/**
 * The main buttons for a plan. They follow your status:
 * none → "Join plan" · requested → waiting · accepted → chat · host → manage group.
 */
export function PlanActions({
  plan,
  status,
  host,
  going,
  secondary,
  hostingNote = true,
}: {
  plan: Plan;
  status: MyStatus;
  host?: Person;
  going: number;
  /** Extra button under the main one ("View details" on the map sheet). */
  secondary?: { title: string; onPress: () => void };
  /** Show "You're hosting this plan." above the buttons (the details page shows it in the page instead). */
  hostingNote?: boolean;
}) {
  const { requestJoin, cancelRequest } = usePlans();
  const [busy, setBusy] = useState(false);
  const params = { id: plan.id };
  const hostName = host?.firstName ?? 'the host';
  const full = going >= plan.capacity;

  const join = async () => {
    setBusy(true);
    await requestJoin(plan.id);
    setBusy(false);
    router.push({ pathname: '/plan/[id]/requested', params });
  };

  return (
    <View style={styles.actions}>
      {status === 'none' && (
        <Button title={full ? 'Plan is full' : 'Join plan'} arrow disabled={full} loading={busy} onPress={join} />
      )}
      {status === 'requested' && (
        <>
          <View style={styles.waiting}>
            <Icon name="clock" color={colors.accent} />
            <Txt variant="label" color={colors.accent} style={{ flex: 1 }}>
              Request sent · waiting for {hostName}
            </Txt>
          </View>
          <Button title="Cancel request" variant="link" onPress={() => cancelRequest(plan.id)} />
        </>
      )}
      {status === 'accepted' && (
        <Button
          title="Open the group chat"
          arrow
          onPress={() => router.push({ pathname: '/plan/[id]/chat', params })}
        />
      )}
      {status === 'host' && (
        <>
          {hostingNote && <HostingNote />}
          <Button title="Edit plan" arrow onPress={() => router.push({ pathname: '/plan/[id]/edit', params })} />
          <View style={styles.pair}>
            <Button
              title="Manage group"
              variant="outline"
              onPress={() => router.push({ pathname: '/plan/[id]/group', params })}
              style={{ flex: 1, minHeight: 50 }}
            />
            <Button
              title="Chat"
              variant="outline"
              onPress={() => router.push({ pathname: '/plan/[id]/chat', params })}
              style={{ flex: 1, minHeight: 50 }}
            />
          </View>
          <Button
            title="Cancel plan"
            variant="link"
            onPress={() => router.push({ pathname: '/plan/[id]/cancel', params })}
            style={{ minHeight: 36 }}
          />
        </>
      )}
      {secondary && <Button title={secondary.title} variant="outline" onPress={secondary.onPress} />}
    </View>
  );
}

/** "You're hosting this plan." (31) */
export function HostingNote() {
  return (
    <View style={styles.hosting}>
      <Icon name="star" color={colors.accent} />
      <Txt variant="label" color={colors.accent}>
        You’re hosting this plan.
      </Txt>
    </View>
  );
}

/** Small label above a plan title: "Request sent", "You're in", or "★ Your plan" (light green, never a day or time). */
export function PlanBadge({ status }: { status: MyStatus }) {
  if (status === 'none') return null;
  const look = {
    requested: { text: 'Request sent', fg: colors.accent, icon: 'clock' as const },
    accepted: { text: 'You’re in', fg: colors.green, icon: 'check' as const },
    host: { text: 'Your plan', fg: colors.mapMineInk, icon: 'star' as const },
  }[status];
  return (
    // Your own plan: a light green label that only says "Your plan" (never a day or time).
    <View style={[styles.badge, status === 'host' && styles.badgeMine]}>
      <Icon name={look.icon} size={14} color={look.fg} />
      <Txt style={[styles.badgeText, { color: look.fg }]}>{look.text}</Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  goingCount: { fontFamily: fonts.sansBold, fontSize: 15, lineHeight: 22, color: colors.dark },
  goingSpots: { fontFamily: fonts.sans, color: colors.accent },
  goingNames: { fontFamily: fonts.sans, fontSize: 15, lineHeight: 22, color: colors.dark },
  pointNote: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  stackRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  stack: { flexDirection: 'row' },
  stackItem: { borderRadius: 20, borderWidth: 2, borderColor: colors.cream },
  more: {
    marginLeft: -10,
    width: 38,
    height: 38,
    backgroundColor: colors.mist,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreText: { fontFamily: fonts.sansBold, fontSize: 12, color: colors.muted },
  point: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  actions: { gap: 10 },
  hosting: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 4 },
  pair: { flexDirection: 'row', gap: 10 },
  waiting: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 44 },
  badge: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', gap: 6, marginBottom: space.xs },
  badgeMine: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, backgroundColor: colors.mapMine },
  badgeText: { fontFamily: fonts.sansBold, fontSize: 12 },
});
