import { useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Icon, type IconName } from './Icon';
import { Plan, Person } from '@/data/types';
import { MyStatus, usePlans } from '@/state/plans';
import { colors, fonts, radius, space } from '@/theme';
import { Avatar } from './Avatar';
import { Button } from './Button';
import { Txt } from './Txt';
import { useMineColours } from '@/state/look';
import { useCity } from '@/state/city';
import { openDirections } from './directions';

/** Overlapping initials + "Maya, Leo, Nora +1". */
export function AvatarStack({
  people,
  max = 3,
  hostId,
  plain,
}: {
  people: Person[];
  max?: number;
  /** Kept for callers; names never carry a host marker. */
  hostId?: string;
  /** Names in regular weight instead of bold. */
  plain?: boolean;
}) {
  const shown = people.slice(0, max);
  const extra = people.length - shown.length;
  const names = goingNames(shown) + (extra > 0 ? ` +${extra}` : '');
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
      <Txt variant="label" style={[{ flex: 1 }, plain && { fontFamily: fonts.sans }]}>
        {names}
      </Txt>
    </View>
  );
}

/** Names, no host marker ("(HOST)" only goes under the initial on plan details and on the profile card). */
export const goingNames = (people: Person[]) => people.map((p) => (p.id === 'me' ? 'You' : p.firstName)).join(', ');

/**
 * "Who's going": "4 people" in bold · "3 spots left" in regular terracotta (same size),
 * then the names below in the normal text colour (no host marker).
 */
export function GoingLine({
  people,
  hostId,
  capacity,
  small,
  names = true,
}: {
  people: Person[];
  hostId: string;
  capacity: number;
  small?: boolean;
  /** Plan details: false, the initials below already show who's going. */
  names?: boolean;
}) {
  const left = Math.max(capacity - people.length, 0);
  // Nested texts get the size too (otherwise they'd fall back to the bigger body size).
  const size = small ? { fontSize: 13, lineHeight: 18 } : { fontSize: 15, lineHeight: 22 };
  return (
    <View style={{ gap: 4 }}>
      <Txt style={[styles.goingCount, size]}>
        {people.length} {people.length === 1 ? 'person' : 'people'}
        <Txt style={[styles.goingSpots, size]}>
          {' '}
          · {left ? `${left} ${left === 1 ? 'spot' : 'spots'} left` : 'full'}
        </Txt>
      </Txt>
      {names && (
        <Txt style={[styles.goingNames, size]}>
          {people.map((p, i) => (
            <Txt key={p.id} style={[styles.goingNames, size]}>
              {i > 0 ? ', ' : ''}
              {p.id === 'me' ? 'You' : p.firstName}
            </Txt>
          ))}
        </Txt>
      )}
    </View>
  );
}

/**
 * Small line under the place, with a pin: "Exact point is shared after joining" (terracotta),
 * or, once you're in, the exact point itself in link blue: tap it for directions in a maps app.
 */
export function PointNote({
  plan,
  status,
  hostName,
  lockedText,
}: {
  plan: Plan;
  status: MyStatus;
  hostName?: string;
  /** Replaces the text while locked ("Exact point is shared once accepted" on Request sent). */
  lockedText?: string;
}) {
  const city = useCity();
  const open = status === 'accepted' || status === 'host';
  if (!open)
    return (
      <View style={styles.pointNote}>
        <Icon name="map-pin" size={14} color={colors.accent} />
        <Txt variant="caption" color={colors.accent} style={{ flexShrink: 1 }}>
          {/* Request sent: "…after Leo accepts" (name from the plan's host). */}
          {lockedText ??
            (status === 'requested' && hostName
              ? `Exact point is shared after ${hostName} accepts`
              : 'Exact point is shared after joining')}
        </Txt>
      </View>
    );
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Directions to ${plan.exactPoint}`}
      accessibilityHint="Opens a maps app"
      onPress={() => openDirections(`${plan.exactPoint}, ${plan.area}, ${city.name}`)}
      hitSlop={8}
      style={({ pressed }) => [styles.pointNote, pressed && { opacity: 0.6 }]}
    >
      {/* Link blue, so it's clear it can be tapped. */}
      <Icon name="map-pin" size={14} color={colors.link} />
      <Txt variant="caption" color={colors.link} style={[{ flexShrink: 1 }, styles.underline]}>
        {plan.exactPoint}
      </Txt>
    </Pressable>
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
  const { requestJoin, cancelRequest, leavePlan } = usePlans();
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

  // A short confirmation first: "Leave this plan?" / "Cancel your request?" with Stay.
  const withdraw = (how: 'leave' | 'cancel') =>
    Alert.alert(
      how === 'leave' ? 'Leave this plan?' : 'Cancel your request?',
      how === 'leave'
        ? `Your spot goes back to the group and you leave the chat. We'll let ${hostName} know.`
        : `We'll let ${hostName} know.`,
      [
        { text: 'Stay', style: 'cancel' },
        {
          text: how === 'leave' ? 'Leave' : 'Cancel request',
          style: 'destructive',
          onPress: () => (how === 'leave' ? leavePlan(plan.id) : cancelRequest(plan.id)),
        },
      ],
    );

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
          <Button title="Cancel request" variant="link" onPress={() => withdraw('cancel')} />
        </>
      )}
      {status === 'accepted' && (
        <>
          <Button
            title="Open the group chat"
            arrow
            onPress={() => router.push({ pathname: '/plan/[id]/chat', params })}
          />
          {/* Discreet, not the main button. */}
          <Button title="Leave plan" variant="link" onPress={() => withdraw('leave')} style={{ minHeight: 36 }} />
        </>
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
  const own = useMineColours();
  if (status === 'none') return null;
  const look = {
    requested: { text: 'Request sent', fg: colors.accent, icon: 'clock' as const },
    accepted: { text: 'You’re in', fg: colors.green, icon: 'check' as const },
    host: { text: 'Your plan', fg: own.fg, icon: 'star' as const },
  }[status];
  return (
    // Your own plan: white bold text on the lighter green fill, only "Your plan" (never a day or time).
    <View style={[styles.badge, status === 'host' && [styles.badgeMine, { backgroundColor: own.bg }]]}>
      <Icon name={look.icon} size={14} color={look.fg} />
      <Txt style={[styles.badgeText, { color: look.fg }]}>{look.text}</Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  goingCount: { fontFamily: fonts.sansBold, fontSize: 15, lineHeight: 22, color: colors.dark },
  goingSpots: { fontFamily: fonts.sans, color: colors.accent },
  goingNames: { fontFamily: fonts.sans, fontSize: 15, lineHeight: 22, color: colors.dark },
  pointNote: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start' },
  underline: { textDecorationLine: 'underline' },
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
  actions: { gap: 10 },
  hosting: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 4 },
  pair: { flexDirection: 'row', gap: 10 },
  waiting: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 44 },
  badge: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', gap: 6, marginBottom: space.xs },
  badgeMine: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  badgeText: { fontFamily: fonts.sansBold, fontSize: 12 },
});
