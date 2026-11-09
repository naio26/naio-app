import { StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Icon, type IconName } from '@/components';
import { Button, Card, Logo, Screen, Txt } from '@/components';
import { planWhen } from '@/data/time';
import { usePlan, usePlans } from '@/state/plans';
import { colors, icon, space } from '@/theme';

// Screen 35 — the host accepted you.
export default function YoureIn() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const plan = usePlan(id);
  const { membersOf } = usePlans();
  if (!plan) return <Screen>{null}</Screen>;
  const going = membersOf(plan).length;

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
      <Logo size={30} color={colors.accent} dotColor={colors.accent} />

      <View style={styles.center}>
        <View style={styles.hero}>
          <Icon name="check" size={icon.hero} color={colors.accent} />
        </View>
        <Txt variant="eyebrow" style={{ letterSpacing: 1.6 }}>
          Plan joined
        </Txt>
        <Txt variant="display" center style={{ fontSize: 44 }}>
          You’re in.
        </Txt>
      </View>

      <Card style={styles.card}>
        <Txt variant="bodyStrong" style={{ fontSize: 18 }}>
          {plan.title}
        </Txt>
        <Txt variant="small">{planWhen(plan)}</Txt>
        <View style={styles.point}>
          <Icon name="map-pin" color={colors.green} />
          <Txt variant="small" color={colors.green} style={{ flex: 1 }}>
            {plan.exactPoint} · {plan.distanceKm} km
          </Txt>
        </View>
        <Txt variant="small">
          {going} people · {plan.language}
        </Txt>
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
  card: { gap: 10, padding: 22, marginTop: space.md },
  point: { flexDirection: 'row', alignItems: 'center', gap: 6 },
});
