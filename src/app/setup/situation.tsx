import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Icon, type IconName } from '@/components';
import { Button, InfoBox, Screen, ScreenHeader, Txt } from '@/components';
import { SITUATIONS } from '@/data/catalog';
import { Situation } from '@/data/types';
import { useProfile } from '@/state/profile';
import { colors, fonts, radius, space } from '@/theme';

const icons: Record<Situation, IconName> = {
  'Living locally': 'home',
  'New in town': 'compass',
  'Travelling solo': 'backpack',
  'Staying temporarily': 'luggage',
};

// Screen 19 — optional: how you're experiencing the city right now.
export default function SituationScreen() {
  const { profile, update } = useProfile();
  const [picked, setPicked] = useState<Situation | undefined>(profile.situation);

  return (
    <Screen
      scroll
      header={<ScreenHeader eyebrow="Optional" title="Your situation" />}
      contentStyle={styles.content}
      footer={
        <Button
          title="Save situation"
          arrow
          disabled={!picked}
          onPress={() => {
            update({ situation: picked });
            router.back();
          }}
        />
      }
    >
      <Txt>
        Choose the option that best describes how you’re experiencing this place right now. You can change it anytime.
      </Txt>
      <View style={styles.grid}>
        {SITUATIONS.map((s) => {
          const on = picked === s;
          return (
            <Pressable
              key={s}
              accessibilityRole="radio"
              accessibilityState={{ checked: on }}
              onPress={() => setPicked(s)}
              style={({ pressed }) => [styles.card, on && styles.cardOn, pressed && { opacity: 0.75 }]}
            >
              <Icon name={icons[s]} color={on ? colors.accent : colors.dark} />
              <Txt style={[styles.label, on && { color: colors.accent }]}>{s.replace(' ', '\n')}</Txt>
            </Pressable>
          );
        })}
      </View>
      <InfoBox text="Your situation gives context to your profile. It does not change who can see you or which plans appear." />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: space.xl, paddingBottom: space.xl, gap: space.xl },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: {
    flexBasis: '45%',
    flexGrow: 1,
    height: 112,
    borderRadius: radius.lg + 2,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
  },
  cardOn: { backgroundColor: colors.accentSoft, borderColor: colors.accentLine, borderWidth: 1.5 },
  label: { fontFamily: fonts.sansBold, fontSize: 14, lineHeight: 18, color: colors.dark, flexShrink: 1 },
});
