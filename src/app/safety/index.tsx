import { Pressable, Share, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Icon, type IconName } from '@/components';
import { Screen, ScreenHeader, Txt } from '@/components';
import { planWhen, toMinutes } from '@/data/time';
import { usePlans } from '@/state/plans';
import { colors, fonts, radius, space } from '@/theme';

// Screen 44 — Safety centre.
export default function SafetyCentre() {
  const { plans, statusOf } = usePlans();
  // Your next plan where you know the exact point (you host it or you've been accepted).
  const next = plans
    .filter((p) => ['host', 'accepted'].includes(statusOf(p)))
    .sort((a, b) => (a.day === b.day ? toMinutes(a.time) - toMinutes(b.time) : a.day === 'today' ? -1 : 1))[0];

  // The phone's own share sheet: nothing goes through naio.
  const share = () =>
    Share.share({
      message: next
        ? `I'm meeting people from naio. — ${next.title}, ${planWhen(next)} at ${next.exactPoint} (${next.area}, Athens).`
        : "I'm using naio. to meet people in Athens. I'll share my plan details when I have one.",
    });

  const rows: { icon: IconName; title: string; sub: string; onPress: () => void }[] = [
    {
      icon: 'flag',
      title: 'Report a person or plan',
      sub: 'Private and reviewed',
      onPress: () => router.push('/safety/report'),
    },
    {
      icon: 'ban',
      title: 'Block someone',
      sub: 'They won’t see or contact you',
      onPress: () => router.push('/safety/block'),
    },
    {
      icon: 'share',
      title: 'Share meetup details',
      sub: next ? `Send ${next.title} to a friend` : 'Send plan and location to a friend',
      onPress: share,
    },
  ];

  return (
    <Screen
      scroll
      header={<ScreenHeader eyebrow="Trust your instincts" title="Safety centre" />}
      contentStyle={{ paddingTop: space.lg, paddingBottom: space.xl, gap: space.md }}
    >
      <View style={styles.hero}>
        <Icon name="shield" color={colors.white} />
        <Txt style={styles.heroTitle}>Real people.{'\n'}Safer moments.</Txt>
        <Txt style={styles.heroText}>
          Meet in public, keep the first plan simple, and tell someone where you’re going.
        </Txt>
      </View>
      {rows.map((r) => (
        <Pressable
          key={r.title}
          accessibilityRole="button"
          onPress={r.onPress}
          style={({ pressed }) => [styles.row, pressed && { opacity: 0.7 }]}
        >
          <Icon name={r.icon} color={colors.dark} />
          <View style={{ flex: 1, gap: 3 }}>
            <Txt variant="bodyStrong">{r.title}</Txt>
            <Txt variant="small">{r.sub}</Txt>
          </View>
          <Icon name="chevron-right" color={colors.muted} />
        </Pressable>
      ))}
      <Txt variant="small" style={{ paddingHorizontal: 8, marginTop: space.sm }}>
        naio is not an emergency service. If you feel unsafe, leave and contact local emergency services (112 in
        Greece).
      </Txt>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { backgroundColor: colors.accentDeep, borderRadius: radius.lg + 8, padding: 28, gap: 14, marginBottom: space.sm },
  heroTitle: { fontFamily: fonts.serif, fontSize: 38, lineHeight: 44, color: colors.white },
  heroText: { fontFamily: fonts.sans, fontSize: 15, lineHeight: 22, color: 'rgba(255,255,255,0.75)' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 18,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
});
