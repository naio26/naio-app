import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Button, Chip, goBack, Screen, ScreenHeader, Txt } from '@/components';
import { availabilityText, DAY_SLOTS } from '@/data/catalog';
import { daySlotAt, demoNow } from '@/data/time';
import { Availability, DaySlot, PlanDay } from '@/data/types';
import { useProfile } from '@/state/profile';
import { colors, fonts, radius, space } from '@/theme';

type When = 'now' | PlanDay;
const WHEN: { key: When; label: string }[] = [
  { key: 'now', label: 'Now' },
  { key: 'today', label: 'Today' },
  { key: 'tomorrow', label: 'Tomorrow' },
];
const ORDER: DaySlot[] = ['morning', 'afternoon', 'evening'];

// Not in the designs (same style): you mark yourself as open to plans, from My profile.
// Now, or Today / Tomorrow with one or more parts of the day. Saved in your profile.
export default function OpenToPlans() {
  const { profile, update } = useProfile();
  const current = profile.available;
  const [when, setWhen] = useState<When | null>(current?.when ?? null);
  const [slots, setSlots] = useState<DaySlot[]>(current && current.when !== 'now' ? current.slots : []);

  // Today, the parts of the day that are already over can't be picked (the demo clock is 4:18 PM).
  const nowSlot = ORDER.indexOf(daySlotAt(demoNow().minutes));
  const options = DAY_SLOTS.filter((s) => when !== 'today' || ORDER.indexOf(s.key) >= nowSlot);
  const picked = slots.filter((s) => options.some((o) => o.key === s));

  const choice: Availability | null =
    when === 'now' ? { when: 'now', slots: [] } : when && picked.length ? { when, slots: picked } : null;

  const toggle = (s: DaySlot) => setSlots((l) => (l.includes(s) ? l.filter((x) => x !== s) : [...l, s]));

  return (
    <Screen
      scroll
      header={<ScreenHeader eyebrow="Your profile" title="Open to plans" />}
      contentStyle={styles.content}
      footer={
        <View style={{ gap: 4 }}>
          <Button
            title={current ? 'Save' : 'Show me as open to plans'}
            arrow
            disabled={!choice}
            onPress={() => {
              if (!choice) return;
              update({ available: choice });
              goBack();
            }}
          />
          {current && (
            <Button
              title="I’m not open to plans anymore"
              variant="link"
              onPress={() => {
                update({ available: undefined });
                goBack();
              }}
            />
          )}
        </View>
      }
    >
      <Txt variant="intro">
        People nearby see you on the map in orange, with your first name and age range. They can’t message you: you’ll
        be told when a nearby plan matches your filters.
      </Txt>

      <View style={styles.section}>
        <Txt variant="question">When are you free?</Txt>
        <View style={styles.row}>
          {WHEN.map((w) => (
            <Chip key={w.key} label={w.label} selected={when === w.key} onPress={() => setWhen(w.key)} />
          ))}
        </View>
      </View>

      {(when === 'today' || when === 'tomorrow') && (
        <View style={styles.section}>
          <Txt variant="question">What part of the day?</Txt>
          <Txt variant="caption" style={{ marginTop: -8 }}>
            Pick one or more.
          </Txt>
          <View style={styles.row}>
            {options.map((s) => {
              const on = picked.includes(s.key);
              return (
                <Pressable
                  key={s.key}
                  accessibilityRole="button"
                  accessibilityState={{ selected: on }}
                  onPress={() => toggle(s.key)}
                  style={[styles.slot, on && styles.slotOn]}
                >
                  <Txt style={[styles.slotTitle, on && styles.slotTitleOn]}>{s.title}</Txt>
                  <Txt style={[styles.slotSub, on && { color: colors.accent }]}>{s.sub}</Txt>
                </Pressable>
              );
            })}
          </View>
        </View>
      )}

      {choice && (
        <View style={styles.preview}>
          <Txt variant="caption">People will see</Txt>
          <Txt variant="bodyStrong" color={colors.openToPlans}>
            {availabilityText(choice)}
          </Txt>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: space.xl, gap: space.xl },
  section: { gap: 14 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  slot: {
    flex: 1,
    minWidth: 92,
    height: 64,
    gap: 3,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotOn: { backgroundColor: colors.accentSoft, borderColor: colors.accentLine },
  slotTitle: { fontFamily: fonts.sans, fontSize: 14, color: colors.dark },
  slotTitleOn: { fontFamily: fonts.sansBold, color: colors.accent },
  slotSub: { fontFamily: fonts.sans, fontSize: 11.5, color: colors.muted },
  preview: { gap: 4, paddingTop: space.lg, borderTopWidth: 1, borderTopColor: colors.border },
});
