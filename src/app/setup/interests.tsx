import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Icon, type IconName } from '@/components';
import { Button, Screen, ScreenHeader, Txt } from '@/components';
import { INTERESTS, MAX_INTERESTS, MIN_INTERESTS } from '@/data/catalog';
import { useProfile } from '@/state/profile';
import { colors, fonts, radius, space } from '@/theme';

// Screen 18 — 3 to 8 interests. They show up on your profile as "My kind of plans".
export default function Interests() {
  const { profile, update } = useProfile();
  const [picked, setPicked] = useState<string[]>(profile.interests);
  const full = picked.length >= MAX_INTERESTS;

  const toggle = (i: string) =>
    setPicked((p) => (p.includes(i) ? p.filter((x) => x !== i) : p.length >= MAX_INTERESTS ? p : [...p, i]));

  const save = () => {
    update({ interests: picked });
    router.back();
  };

  const short = MIN_INTERESTS - picked.length;

  return (
    <Screen
      scroll
      header={<ScreenHeader eyebrow="Your profile" title="What are you into?" />}
      contentStyle={styles.content}
      footer={
        <View style={{ gap: 12 }}>
          <Txt variant="caption" center>
            {picked.length} of {MAX_INTERESTS} selected
          </Txt>
          <Button
            title={short > 0 ? `Pick ${short} more` : 'Save selection'}
            arrow
            disabled={short > 0}
            onPress={save}
          />
        </View>
      }
    >
      <Txt>Select 3–8 interests. The ones you choose will appear together on your profile.</Txt>
      <View style={styles.grid}>
        {INTERESTS.map((i) => {
          const on = picked.includes(i);
          const dim = full && !on;
          return (
            <Pressable
              key={i}
              accessibilityRole="button"
              accessibilityState={{ selected: on, disabled: dim }}
              onPress={() => toggle(i)}
              style={({ pressed }) => [
                styles.tile,
                on && styles.tileOn,
                dim && { opacity: 0.45 },
                pressed && { opacity: 0.7 },
              ]}
            >
              <Txt style={[styles.label, on && styles.labelOn]}>{i}</Txt>
              <Icon name={on ? 'check' : 'plus'} color={on ? colors.accent : colors.muted} />
            </Pressable>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: space.xl, paddingBottom: space.lg, gap: space.xl },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  tile: {
    width: '48.5%',
    flexGrow: 1,
    flexBasis: '45%',
    height: 56,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
  },
  tileOn: { backgroundColor: colors.accentSoft, borderColor: colors.accentLine, borderWidth: 1.5 },
  label: { fontFamily: fonts.sans, fontSize: 16, color: colors.dark },
  labelOn: { fontFamily: fonts.sansBold, color: colors.accent },
});
