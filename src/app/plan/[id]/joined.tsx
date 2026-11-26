import { StyleSheet, View } from 'react-native';
import { languagesText } from '@/data/catalog';
import { router, useLocalSearchParams } from 'expo-router';
import { Icon, type IconName } from '@/components';
import { Button, Card, GoingLine, Logo, Screen, Txt } from '@/components';
import { planWhen } from '@/data/time';
import { usePeople } from '@/state/people';
import { usePlan, usePlans } from '@/state/plans';
import { colors, icon, space } from '@/theme';

// Screen 35 — the host accepted you.
export default function YoureIn() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const plan = usePlan(id);
  const { membersOf } = usePlans();
  const members = usePeople(plan ? membersOf(plan) : []);
  if (!plan) return <Screen>{null}</Screen>;

  return (
    <Screen
      contentStyle={styles.content}
      footer={
        <View style={{ gap: 4 }}>
          <Button
            title="Say hi in the chat"
            arrow
            onPress={() => router.push({ pathname: '/plan/[id]/chat', params: { id } })}
          />
          <Button title="Back to the map" variant="link" onPress={() => router.dismissTo('/map')} />
        </View>
      }
    >
      <Logo size={26} />

      <View style={styles.center}>
        <View style={styles.hero}>
          <Icon name="check" size={icon.hero} color={colors.accent} />
        </View>
        <Txt variant="eyebrow" style={{ letterSpacing: 1.6 }}>
          Plan joined
        </Txt>
        <Txt variant="display" center>
          You’re in.
        </Txt>
      </View>

      <Card style={styles.card}>
        <Txt variant="bodyStrong" style={{ fontSize: 18 }}>
          {plan.title}
        </Txt>
        <Txt variant="small" color={colors.green}>
          {planWhen(plan)}
        </Txt>
        <View style={styles.point}>
          <Icon name="map-pin" color={colors.green} />
          <Txt variant="small" color={colors.green} style={{ flex: 1 }}>
            {plan.exactPoint} · {plan.distanceKm} km
          </Txt>
        </View>
        {/* "3 people" bold · "3 spots left" terracotta, then the names (no host marker). */}
        <GoingLine people={members} hostId={plan.hostId} capacity={plan.capacity} small />
        <Txt variant="small">{languagesText(plan.languages)}</Txt>
      </Card>

      <Txt variant="small" center style={{ fontSize: 14 }}>
        The exact meeting point and temporary chat are now available.
      </Txt>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: space.xl, gap: space.xl },
  center: { alignItems: 'center', gap: 14, marginTop: space.xl },
  hero: { marginBottom: space.sm },
  // You're in the plan: very light green fill and a stronger green border.
  card: {
    gap: 10,
    padding: 22,
    marginTop: space.md,
    backgroundColor: colors.greenLight,
    borderColor: colors.greenLine,
    borderWidth: 1.5,
  },
  point: { flexDirection: 'row', alignItems: 'center', gap: 6 },
});
