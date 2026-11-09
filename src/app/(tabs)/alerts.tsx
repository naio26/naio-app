import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Icon, type IconName } from '@/components';
import { Avatar, Card, Screen, Txt } from '@/components';
import { ago } from '@/data/time';
import { Notice } from '@/data/types';
import { useAlerts } from '@/state/alerts';
import { usePeople } from '@/state/people';
import { usePlans } from '@/state/plans';
import { useSafety } from '@/state/safety';
import { colors, fonts, space } from '@/theme';

const icons: Record<Notice['kind'], IconName> = {
  'join-request': 'user-plus',
  message: 'message-circle',
  match: 'map-pin',
  accepted: 'check',
  cancelled: 'x',
};

// Screen 39 — Notifications. Only joins, relevant nearby plans and plan-chat messages.
export default function AlertsTab() {
  const { notices } = useAlerts();
  const { prefs } = useSafety();
  const shown = notices.filter((n) =>
    n.kind === 'message' ? prefs.messages : n.kind === 'match' ? prefs.matches : prefs.joins,
  );

  return (
    <Screen scroll edges={['top']} contentStyle={styles.content}>
      <Txt variant="display" style={styles.title}>
        Notifications
      </Txt>
      <View>
        {shown.map((n) => (
          <Row key={n.id} n={n} />
        ))}
        {shown.length === 0 && <Txt style={{ paddingVertical: space.lg }}>You’re all caught up.</Txt>}
      </View>
      <Card tone="muted" style={styles.noNoise}>
        <Txt style={styles.noNoiseTitle}>No noise.</Txt>
        <Txt variant="small" style={{ fontSize: 14 }}>
          Only joins, relevant nearby plans and plan-chat messages.
        </Txt>
      </Card>
    </Screen>
  );
}

function Row({ n }: { n: Notice }) {
  const { markRead } = useAlerts();
  const { requests } = usePlans();
  const [person] = usePeople(n.personId && n.kind === 'join-request' ? [n.personId] : []);
  const pending = n.kind === 'join-request' && requests.find((r) => r.id === n.requestId)?.status === 'pending';

  const open = () => {
    markRead(n.id);
    if (n.kind === 'join-request' && n.requestId)
      router.push({ pathname: '/request/[id]', params: { id: n.requestId } });
    else if ((n.kind === 'message' || n.kind === 'accepted') && n.planId)
      router.push({ pathname: '/plan/[id]/chat', params: { id: n.planId } });
    else if (n.kind === 'match' && n.planId) router.push({ pathname: '/plan/[id]', params: { id: n.planId } });
  };

  return (
    <Pressable
      accessibilityRole="button"
      onPress={open}
      style={({ pressed }) => [styles.row, pressed && { opacity: 0.7 }]}
    >
      {person ? (
        <Avatar initials={person.initials} size={56} color={person.avatarColor} serif />
      ) : (
        <View style={styles.icon}>
          <Icon name={icons[n.kind]} color={colors.dark} />
        </View>
      )}
      <View style={{ flex: 1, gap: 4 }}>
        <Txt variant="bodyStrong">{n.title}</Txt>
        <Txt variant="small">
          {n.subtitle} · {ago(n.minutesAgo)}
        </Txt>
        {pending && (
          <Txt variant="label" color={colors.accent} style={{ fontSize: 14 }}>
            View profile before deciding
          </Txt>
        )}
      </View>
      {!n.read && <View style={styles.unread} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: space.xl, gap: space.xl },
  title: { marginTop: space.xxl },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  icon: { width: 56, alignItems: 'center' }, // same width as an avatar, so texts line up
  unread: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.brandDot },
  noNoise: { padding: 24, gap: 6 },
  noNoiseTitle: { fontFamily: fonts.serifBold, fontSize: 28, lineHeight: 34, color: colors.dark },
});
