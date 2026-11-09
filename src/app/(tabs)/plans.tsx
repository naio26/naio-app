import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Icon, type IconName } from '@/components';
import { Avatar, Button, Card, PlanBadge, PlanCard, Screen, Txt } from '@/components';
import { listPastPlans } from '@/data/api';
import { useLoad } from '@/data/hooks';
import { planWhen, toMinutes } from '@/data/time';
import { Plan } from '@/data/types';
import { usePeople } from '@/state/people';
import { usePlans } from '@/state/plans';
import { colors, fonts, radius, space } from '@/theme';

type Tab = 'upcoming' | 'requests' | 'past';

const order = (p: Plan) => (p.day === 'tomorrow' ? 24 * 60 : 0) + toMinutes(p.time);

// Screen 37 — My plans. Upcoming and Requests are not in the designs (drawn in the same style).
export default function MyPlans() {
  const { plans, statusOf, requests } = usePlans();
  const [tab, setTab] = useState<Tab>('upcoming');
  const past = useLoad(listPastPlans, []) ?? [];

  const upcoming = plans.filter((p) => statusOf(p) !== 'none').sort((a, b) => order(a) - order(b));
  const incoming = requests.filter((r) => r.status === 'pending' && plans.some((p) => p.id === r.planId));
  const sent = plans.filter((p) => statusOf(p) === 'requested');
  const counts = { upcoming: upcoming.length, requests: incoming.length + sent.length, past: 0 };

  return (
    <Screen scroll edges={['top']} padded={false} contentStyle={{ paddingBottom: space.xl }}>
      <Txt variant="display" style={styles.title}>
        My plans
      </Txt>
      <View style={styles.tabs}>
        {(['upcoming', 'requests', 'past'] as const).map((t) => {
          const on = tab === t;
          return (
            <Pressable
              key={t}
              accessibilityRole="tab"
              accessibilityState={{ selected: on }}
              onPress={() => setTab(t)}
              style={[styles.tab, on && styles.tabOn]}
            >
              <Txt style={[styles.tabText, on && styles.tabTextOn]}>{t[0].toUpperCase() + t.slice(1)}</Txt>
              {counts[t] > 0 && (
                <View style={styles.count}>
                  <Txt style={styles.countText}>{counts[t]}</Txt>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>

      <View style={styles.body}>
        {tab === 'upcoming' && (
          <>
            {upcoming.map((p) => (
              <UpcomingCard key={p.id} plan={p} />
            ))}
            {upcoming.length === 0 && (
              <Empty
                title="Nothing planned yet."
                text="Join a plan on the map or post your own for today or tomorrow."
                action={<Button title="Create a plan" arrow onPress={() => router.push('/create')} />}
              />
            )}
            <Forever />
          </>
        )}

        {tab === 'requests' && (
          <>
            {incoming.length > 0 && <Txt style={styles.section}>To your plans</Txt>}
            {incoming.map((r) => (
              <IncomingRow
                key={r.id}
                requestId={r.id}
                personId={r.personId}
                planTitle={plans.find((p) => p.id === r.planId)?.title ?? ''}
              />
            ))}
            {sent.length > 0 && <Txt style={styles.section}>Sent by you</Txt>}
            {sent.map((p) => (
              <SentRow key={p.id} plan={p} />
            ))}
            {incoming.length + sent.length === 0 && (
              <Empty
                title="No requests right now."
                text="When someone asks to join your plan, or you ask to join one, it shows up here."
              />
            )}
          </>
        )}

        {tab === 'past' && (
          <>
            {past.map((p) => (
              <PlanCard
                key={p.id}
                eyebrow={`Past · ${p.when}`}
                title={p.title}
                line={`${p.area} · ${p.people.slice(0, 3).join(', ')}${p.people.length > 3 ? ` +${p.people.length - 3}` : ''}`}
                footer={
                  <Txt variant="small" color={colors.dark}>
                    Plan information only · chat closed
                  </Txt>
                }
              />
            ))}
            <Forever />
          </>
        )}
      </View>
    </Screen>
  );
}

function UpcomingCard({ plan }: { plan: Plan }) {
  const { statusOf, membersOf } = usePlans();
  const members = usePeople(membersOf(plan));
  const names = members.filter((m) => m.id !== 'me').map((m) => m.firstName);
  return (
    <PlanCard
      eyebrow={planWhen(plan)}
      title={plan.title}
      time={plan.time}
      moods={plan.moods}
      line={`${plan.area} · ${names.length ? names.slice(0, 3).join(', ') + (names.length > 3 ? ` +${names.length - 3}` : '') : 'Only you so far'}`}
      footer={
        <View style={{ marginTop: 4 }}>
          <PlanBadge status={statusOf(plan)} />
        </View>
      }
      onPress={() => router.push({ pathname: '/plan/[id]', params: { id: plan.id } })}
    />
  );
}

function IncomingRow({ requestId, personId, planTitle }: { requestId: string; personId: string; planTitle: string }) {
  const [person] = usePeople([personId]);
  if (!person) return null;
  return (
    <Pressable onPress={() => router.push({ pathname: '/request/[id]', params: { id: requestId } })} style={styles.row}>
      <Avatar initials={person.initials} size={48} color={person.avatarColor} verified={person.verified} serif />
      <View style={{ flex: 1, gap: 3 }}>
        <Txt variant="bodyStrong">{person.firstName} wants to join</Txt>
        <Txt variant="small">{planTitle}</Txt>
      </View>
      <Txt variant="label" color={colors.accent}>
        Review
      </Txt>
    </Pressable>
  );
}

function SentRow({ plan }: { plan: Plan }) {
  const [host] = usePeople([plan.hostId]);
  return (
    <Pressable onPress={() => router.push({ pathname: '/plan/[id]', params: { id: plan.id } })} style={styles.row}>
      <Icon name="clock" color={colors.muted} />
      <View style={{ flex: 1, gap: 3 }}>
        <Txt variant="bodyStrong">{plan.title}</Txt>
        <Txt variant="small">
          Waiting for {host?.firstName ?? 'the host'} · {planWhen(plan)}
        </Txt>
      </View>
      <Icon name="chevron-right" color={colors.muted} />
    </Pressable>
  );
}

function Forever() {
  return (
    <Card tone="muted" style={styles.forever}>
      <Icon name="clock" color={colors.muted} />
      <View style={{ flex: 1, gap: 4 }}>
        <Txt variant="label">Plans don’t live forever.</Txt>
        <Txt variant="caption">They disappear after they happen. Chats go with them.</Txt>
      </View>
    </Card>
  );
}

function Empty({ title, text, action }: { title: string; text: string; action?: React.ReactNode }) {
  return (
    <View style={styles.empty}>
      <Txt variant="h2">{title}</Txt>
      <Txt>{text}</Txt>
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  title: { paddingHorizontal: space.gutter, marginTop: space.xxl, marginBottom: space.lg },
  tabs: {
    flexDirection: 'row',
    gap: 28,
    paddingHorizontal: space.gutter,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabOn: { borderBottomColor: colors.accent },
  tabText: { fontFamily: fonts.sans, fontSize: 17, color: colors.muted },
  tabTextOn: { fontFamily: fonts.sansBold, color: colors.dark },
  count: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  countText: { fontFamily: fonts.sansMedium, fontSize: 13, color: colors.accent },
  body: { paddingHorizontal: space.lg + 4, paddingTop: space.xl, gap: space.lg },
  section: {
    fontFamily: fonts.sansBold,
    fontSize: 12,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: colors.muted,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  forever: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 20, marginTop: space.sm },
  empty: { gap: 12, paddingVertical: space.lg },
});
