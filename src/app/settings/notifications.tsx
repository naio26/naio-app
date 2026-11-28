import { StyleSheet, Switch, View } from 'react-native';
import { InfoBox, Screen, ScreenHeader, Txt } from '@/components';
import { NotifyPrefs, useSafety } from '@/state/safety';
import { colors, space } from '@/theme';

const rows: { key: keyof NotifyPrefs; title: string; sub: string }[] = [
  { key: 'joins', title: 'Joins', sub: 'Requests to your plans and answers to yours' },
  { key: 'matches', title: 'Nearby plans that match you', sub: 'Based on your filters' },
  { key: 'messages', title: 'Plan-chat messages', sub: 'From plans you’re in' },
];

export default function NotificationPrefs() {
  const { prefs, setPrefs } = useSafety();
  return (
    <Screen
      scroll
      header={<ScreenHeader eyebrow="Privacy" title="Notifications" />}
      contentStyle={{ paddingTop: space.lg, gap: space.xl }}
    >
      <View>
        {rows.map((r) => (
          <View key={r.key} style={styles.row}>
            <View style={{ flex: 1, gap: 4 }}>
              <Txt variant="bodyStrong">{r.title}</Txt>
              <Txt variant="small">{r.sub}</Txt>
            </View>
            <Switch
              value={prefs[r.key]}
              onValueChange={(v) => setPrefs({ ...prefs, [r.key]: v })}
              trackColor={{ true: colors.accentFill, false: colors.border }}
              thumbColor={colors.white}
            />
          </View>
        ))}
      </View>
      <InfoBox title="No noise" text="naio only tells you about these three things. Never ads or promotions." />
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
});
