import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Icon, type IconName } from '@/components';
import { Button, Card, Logo, Screen, Txt } from '@/components';
import { planWhen } from '@/data/time';
import { usePeople } from '@/state/people';
import { usePlan, usePlans } from '@/state/plans';
import { colors, fonts, icon, space } from '@/theme';

// NEW screen (not in the designs): shown after "Join plan" while the host decides.
export default function RequestSent() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const plan = usePlan(id);
  const { statusOf, membersOf, cancelRequest } = usePlans();
  const members = usePeople(plan ? membersOf(plan) : []);
  const host = members.find((m) => m.id === plan?.hostId);
  const status = plan ? statusOf(plan) : 'requested';
  const pulse = useRef(new Animated.Value(0)).current;

  // The clock breathes softly while we wait.
  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(pulse, { toValue: 1, duration: 2000, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  // When the host accepts (demo: after a few seconds), show "You're in".
  useEffect(() => {
    if (status === 'accepted') router.replace({ pathname: '/plan/[id]/joined', params: { id } });
  }, [status, id]);

  if (!plan) return <Screen>{null}</Screen>;
  const hostName = host?.firstName ?? 'The host';

  return (
    <Screen
      scroll
      contentStyle={styles.content}
      footer={
        <View style={{ gap: 4 }}>
          <Button title="Back to the map" variant="outline" onPress={() => router.dismissTo('/map')} />
          <Button
            title="Cancel request"
            variant="link"
            onPress={async () => {
              await cancelRequest(plan.id);
              router.back();
            }}
          />
        </View>
      }
    >
      <Logo size={30} color={colors.accent} dotColor={colors.accent} />

      <View style={styles.center}>
        <Animated.View
          style={[styles.hero, { opacity: pulse.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 0.45, 1] }) }]}
        >
          <Icon name="clock" size={icon.hero} color={colors.accent} />
        </Animated.View>
        <Txt variant="eyebrow" style={{ letterSpacing: 1.6 }}>
          Request sent
        </Txt>
        <Txt variant="display" center style={{ fontSize: 40 }}>
          Nearly there.
        </Txt>
        <Txt center>
          {hostName} has your request. Once they accept, you’ll be active in the group chat and see the exact meeting
          point.
        </Txt>
      </View>

      <Card style={styles.card}>
        <Txt variant="bodyStrong" style={{ fontSize: 18 }}>
          {plan.title}
        </Txt>
        <Txt variant="small">{planWhen(plan)}</Txt>
        <Txt variant="small">
          Near {plan.meetNear} · {plan.distanceKm} km
        </Txt>
        <Txt variant="small">
          {members.length} people · {plan.language}
        </Txt>
      </Card>

      <View style={styles.locks}>
        <LockRow name="message-circle" title="Group chat" text={`Unlocks when ${hostName} accepts`} />
        <LockRow name="map-pin" title="Exact meeting point" text="Shared after joining" />
      </View>

      <View style={styles.waiting}>
        <Icon name="loader" color={colors.muted} />
        <Txt variant="caption">Waiting for {hostName}…</Txt>
      </View>
    </Screen>
  );
}

function LockRow({ name, title, text }: { name: 'message-circle' | 'map-pin'; title: string; text: string }) {
  return (
    <View style={styles.lockRow}>
      <Icon name={name} color={colors.muted} />
      <View style={{ flex: 1, gap: 2 }}>
        <Txt variant="label">{title}</Txt>
        <Txt variant="caption">{text}</Txt>
      </View>
      <Icon name="lock" color={colors.faint} />
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: space.xl, paddingBottom: space.lg, gap: space.xl },
  center: { alignItems: 'center', gap: 14, marginTop: space.md },
  hero: { marginBottom: space.sm },
  card: { gap: 8, padding: 22 },
  locks: { gap: 4 },
  lockRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 10 },
  waiting: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
});
