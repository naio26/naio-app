import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import {
  Button,
  Chip,
  goBack,
  LanguagePicker,
  RangeSlider,
  Screen,
  ScreenHeader,
  Txt,
} from '@/components';
import { DISTANCES, MOODS } from '@/data/catalog';
import { AGE_RANGES, Filters, Gender, GENDERS, TimeWindow } from '@/data/types';
import { useCity } from '@/state/city';
import { NO_FILTERS, useFilters } from '@/state/filters';
import { colors, fonts, radius, space } from '@/theme';

const SLOTS = [
  { key: 'morning', title: 'Morning', sub: 'before 12 PM' },
  { key: 'afternoon', title: 'Afternoon', sub: '12 PM–6 PM' },
  { key: 'evening', title: 'Evening', sub: 'after 6 PM' },
] as const;

const toggle = <T,>(list: T[], item: T) => (list.includes(item) ? list.filter((x) => x !== item) : [...list, item]);

// Screens 23–24 — the filters sheet. Changes only count after "Apply filters".
export default function FiltersSheet() {
  const { filters, setFilters } = useFilters();
  const city = useCity();
  const [draft, setDraft] = useState<Filters>(filters);
  const ageValue: [number, number] = draft.ages
    ? [AGE_RANGES.indexOf(draft.ages.from), AGE_RANGES.indexOf(draft.ages.to)]
    : [0, AGE_RANGES.length - 1];
  const set = (changes: Partial<Filters>) => setDraft((d) => ({ ...d, ...changes }));

  const distanceHint =
    draft.maxKm === null
      ? 'Any distance · pick one to set a limit'
      : draft.maxKm === Infinity
        ? 'Any distance, even more than 30 km'
        : `Up to ${draft.maxKm} km · includes every closer plan`;

  return (
    <Screen
      scroll
      edges={['bottom']}
      header={
        <View>
          <View style={styles.grabber} />
          <ScreenHeader
            eyebrow="Find your fit"
            title="Filters"

            large
            right={
              <Pressable
                accessibilityRole="button"
                hitSlop={12}
                onPress={() => setDraft(NO_FILTERS)}
                style={{ paddingBottom: 12 }}
              >
                <Txt style={styles.reset}>Reset</Txt>
              </Pressable>
            }
          />
        </View>
      }
      contentStyle={styles.content}
      footer={
        <Button
          title="Apply filters"
          arrow
          onPress={() => {
            setFilters(draft);
            goBack();
          }}
        />
      }
    >
      {/* Distance */}
      <View style={styles.section}>
        <Txt variant="question" style={styles.q}>
          How far would you go?
        </Txt>
        <View style={styles.boxes}>
          {DISTANCES.map((d) => {
            const on = draft.maxKm !== null && d.maxKm <= draft.maxKm;
            return (
              <Pressable
                key={d.label}
                accessibilityRole="button"
                accessibilityState={{ selected: on }}
                onPress={() => set({ maxKm: draft.maxKm === d.maxKm ? null : d.maxKm })}
                style={[styles.box, styles.distance, on && styles.boxOn]}
              >
                <Txt style={[styles.boxTitle, on && styles.boxTitleOn]}>{d.label}</Txt>
              </Pressable>
            );
          })}
        </View>
        <Txt variant="caption">{distanceHint}</Txt>
      </View>

      {/* Mood */}
      <View style={styles.section}>
        <Txt variant="question" style={styles.q}>
          What are you in the mood for?
        </Txt>
        <View style={styles.chips}>
          {MOODS.map((m) => (
            <Chip
              key={m}
              label={m}
              selected={draft.moods.includes(m)}
              onPress={() => set({ moods: toggle(draft.moods, m) })}
            />
          ))}
        </View>
      </View>

      {/* Gender of the person hosting the plan */}
      <View style={styles.section}>
        <Txt variant="question" style={styles.q}>
          Who’s hosting?
        </Txt>
        <Txt variant="caption" style={{ marginTop: -6 }}>
          Leave empty to see plans from everyone.
        </Txt>
        <View style={styles.chips}>
          {GENDERS.map((g) => (
            <Chip
              key={g}
              label={g}
              selected={draft.genders.includes(g)}
              onPress={() => set({ genders: toggle<Gender>(draft.genders, g) })}
            />
          ))}
        </View>
      </View>

      {/* Language */}
      <View style={styles.section}>
        <Txt variant="question" style={styles.q}>
          Which language do you want the activity to be in?
        </Txt>
        <Txt variant="caption" style={{ marginTop: -6 }}>
          Leave empty for any language. Suggested languages considering your location.
        </Txt>
        <LanguagePicker selected={draft.languages} onChange={(languages) => set({ languages })} />
      </View>

      {/* Age range of the people you want to make plans with: snaps to the official ranges */}
      <View style={styles.section}>
        <Txt variant="question" style={styles.q}>
          Age range
        </Txt>
        <Txt variant="caption" style={{ marginTop: -6 }}>
          {draft.ages ? `People aged ${draft.ages.from} to ${draft.ages.to}` : 'People of any age'}
        </Txt>
        <RangeSlider
          steps={AGE_RANGES}
          value={ageValue}
          onChange={([a, b]) =>
            set({ ages: a === 0 && b === AGE_RANGES.length - 1 ? null : { from: AGE_RANGES[a], to: AGE_RANGES[b] } })
          }
        />
      </View>

      {/* When */}
      <View style={styles.section}>
        <Txt variant="question" style={styles.q}>
          When?
        </Txt>
        <Txt variant="caption" style={{ marginTop: -6 }}>
          You can combine more than one time window.
        </Txt>
        {/* Day above its options, so the boxes get the full width. "Now" sits on the left, one box wide. */}
        <View style={styles.whenGroup}>
          <Txt style={styles.day}>Now</Txt>
          <View style={styles.whenRow}>
            <Slot
              title="Available"
              sub="next 2 hours"
              on={draft.when.includes('now')}
              onPress={() => set({ when: toggle<TimeWindow>(draft.when, 'now') })}
            />
            <View style={{ flex: 1 }} />
            <View style={{ flex: 1 }} />
          </View>
        </View>
        {(['today', 'tomorrow'] as const).map((day) => (
          <View key={day} style={styles.whenGroup}>
            <Txt style={styles.day}>{day === 'today' ? 'Today' : 'Tomorrow'}</Txt>
            <View style={styles.whenRow}>
              {SLOTS.map((s) => {
                const key = `${day}-${s.key}` as TimeWindow;
                return (
                  <Slot
                    key={key}
                    title={s.title}
                    sub={s.sub}
                    on={draft.when.includes(key)}
                    onPress={() => set({ when: toggle(draft.when, key) })}
                  />
                );
              })}
            </View>
          </View>
        ))}
      </View>
    </Screen>
  );
}

function Slot({ title, sub, on, onPress }: { title: string; sub: string; on: boolean; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: on }}
      onPress={onPress}
      style={[styles.box, styles.slot, on && styles.boxOn]}
    >
      <Txt style={[styles.slotTitle, on && styles.boxTitleOn]}>{title}</Txt>
      <Txt numberOfLines={1} style={[styles.slotSub, on && { color: colors.accent, fontFamily: fonts.sansMedium }]}>
        {sub}
      </Txt>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  grabber: {
    alignSelf: 'center',
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.border,
    marginTop: 10,
  },
  reset: { fontFamily: fonts.sans, fontSize: 16, color: colors.accent },
  q: { fontSize: 17, lineHeight: 23 },
  content: { paddingTop: space.xl, paddingBottom: space.xl },
  section: {
    gap: 16,
    paddingBottom: space.xl,
    marginBottom: space.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  boxes: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  box: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxOn: { backgroundColor: colors.accentSoft, borderColor: colors.accentLine, borderWidth: 1.5 },
  distance: { width: '31%', height: 50 },
  boxTitle: { fontFamily: fonts.sans, fontSize: 14, color: colors.dark },
  boxTitleOn: { fontFamily: fonts.sansBold, color: colors.accent },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  whenGroup: { gap: 8 },
  whenRow: { flexDirection: 'row', gap: 10 },
  day: { fontFamily: fonts.sansBold, fontSize: 14, color: colors.accent },
  // Same border width on and off, so a selected box doesn't shrink its text.
  slot: { flex: 1, height: 64, gap: 3, paddingHorizontal: 6, borderWidth: 1.5 },
  slotTitle: { fontFamily: fonts.sans, fontSize: 14, color: colors.dark },
  slotSub: { fontFamily: fonts.sans, fontSize: 11.5, color: colors.muted },
});
