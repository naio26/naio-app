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

/** GOING / SPOTS / LANGUAGE boxes (screen 26). */
export function PlanFacts({ plan, going }: { plan: Plan; going: number }) {
  const left = Math.max(plan.capacity - going, 0);
  const facts = [
    { label: 'Going', value: `${going} ${going === 1 ? 'person' : 'people'}` },
    { label: 'Spots', value: left ? `${left} left` : 'Full' },
    { label: 'Language', value: plan.language },
  ];
  return (
    <View style={styles.facts}>
      {facts.map((f) => (
        <View key={f.label} style={styles.fact}>
          <Txt style={styles.factLabel}>{f.label}</Txt>
          <Txt variant="label">{f.value}</Txt>
        </View>
      ))}
    </View>
  );
}

/** Overlapping initials + "Maya, Leo, Nora +1". */
export function AvatarStack({ people, max = 3 }: { people: Person[]; max?: number }) {
  const shown = people.slice(0, max);
  const extra = people.length - shown.length;
  const names = shown.map((p) => (p.id === 'me' ? 'You' : p.firstName)).join(', ') + (extra > 0 ? ` +${extra}` : '');
  return (
    <View style={styles.stackRow}>
      <View style={styles.stack}>
        {shown.map((p, i) => (
          <View key={p.id} style={[styles.stackItem, { marginLeft: i === 0 ? 0 : -10, zIndex: max - i }]}>
            <Avatar initials={p.initials} size={34} color={p.id === 'me' ? colors.accent : p.avatarColor} />
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

/** Small label above a plan title: "TODAY · 6:00 PM" or "YOUR PLAN · TODAY · 7:30 PM". */
export function PlanBadge({ status }: { status: MyStatus }) {
  if (status === 'none') return null;
  const look = {
    requested: { text: 'Request sent', fg: colors.accent, icon: 'clock' as const },
    accepted: { text: 'You’re in', fg: colors.green, icon: 'check' as const },
    host: { text: 'Your plan', fg: colors.accent, icon: 'star' as const },
  }[status];
  return (
    <View style={styles.badge}>
      <Icon name={look.icon} color={look.fg} />
      <Txt style={[styles.badgeText, { color: look.fg }]}>{look.text}</Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  facts: { flexDirection: 'row', gap: 8 },
  fact: {
    flex: 1,
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  factLabel: {
    fontFamily: fonts.sansBold,
    fontSize: 10.5,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.muted,
  },
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
  badgeText: { fontFamily: fonts.sansBold, fontSize: 12 },
});
