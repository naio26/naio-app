import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Button, Chip, InfoBox, Screen, ScreenHeader, Txt } from '@/components';
import { DISTANCES, LANGUAGES, MOODS, SUGGESTED_PLAN_LANGUAGES } from '@/data/catalog';
import { Filters, TimeWindow } from '@/data/types';
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
  const [draft, setDraft] = useState<Filters>(filters);
  const [moreLangs, setMoreLangs] = useState(false);
  const set = (changes: Partial<Filters>) => setDraft((d) => ({ ...d, ...changes }));

  const distanceHint =
    draft.maxKm === null
      ? 'Any distance · pick one to set a limit'
      : draft.maxKm === Infinity
        ? 'Any distance, even more than 30 km'
        : `Up to ${draft.maxKm} km · includes every closer plan`;

  // Suggested languages first, then any extra ones you added with "+ Add".
  const langChips = [
    ...SUGGESTED_PLAN_LANGUAGES,
    ...draft.languages.filter((l) => !SUGGESTED_PLAN_LANGUAGES.includes(l)),
  ];
  const otherLangs = LANGUAGES.map((l) => l.name).filter((n) => !langChips.includes(n));

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
            router.back();
          }}
        />
      }
    >
      {/* Distance */}
      <View style={styles.section}>
        <Txt variant="question">How far would you go?</Txt>
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
        <Txt variant="question">What are you in the mood for?</Txt>
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

      {/* Language */}
      <View style={styles.section}>
        <Txt variant="question">Which language do you want the activity to be in?</Txt>
        <Txt variant="caption" style={{ marginTop: -6 }}>
          Leave empty for any language. Suggested languages adapt to your location.
        </Txt>
        <View style={styles.chips}>
          {langChips.map((l) => (
            <Chip
              key={l}
              label={l}
              selected={draft.languages.includes(l)}
              onPress={() => set({ languages: toggle(draft.languages, l) })}
            />
          ))}
          <Chip label={moreLangs ? '− Less' : '+ Add'} onPress={() => setMoreLangs((v) => !v)} />
        </View>
        {moreLangs && (
          <View style={[styles.chips, styles.moreLangs]}>
            {otherLangs.map((l) => (
              <Chip key={l} size="sm" label={l} onPress={() => set({ languages: [...draft.languages, l] })} />
            ))}
          </View>
        )}
      </View>

      {/* When */}
      <View style={styles.section}>
        <Txt variant="question">When?</Txt>
        <Txt variant="caption" style={{ marginTop: -6 }}>
          You can combine more than one time window.
        </Txt>
        <View style={styles.whenRow}>
          <Txt style={styles.day}>Now</Txt>
          <Slot
            title="Available"
            sub="for the next 2 hours"
            on={draft.when.includes('now')}
            onPress={() => set({ when: toggle<TimeWindow>(draft.when, 'now') })}
            wide
          />
        </View>
        {(['today', 'tomorrow'] as const).map((day) => (
          <View key={day} style={styles.whenRow}>
            <Txt style={styles.day}>{day === 'today' ? 'Today' : 'Tomorrow'}</Txt>
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
        ))}
      </View>

      <InfoBox
        title="✓ Everyone is verified"
        text="All naio profiles complete an age and selfie check."
        style={{ marginTop: space.sm }}
      />
    </Screen>
  );
}

function Slot({
  title,
  sub,
  on,
  onPress,
  wide,
}: {
  title: string;
  sub: string;
  on: boolean;
  onPress: () => void;
  wide?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: on }}
      onPress={onPress}
      style={[styles.box, styles.slot, wide && styles.slotWide, on && styles.boxOn]}
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
  reset: { fontFamily: fonts.sans, fontSize: 18, color: colors.accent },
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
  moreLangs: { padding: 12, borderRadius: radius.md, backgroundColor: colors.mist },
  whenRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  day: { width: 72, fontFamily: fonts.sansBold, fontSize: 14, color: colors.dark },
  slot: { flex: 1, height: 60, gap: 2, paddingHorizontal: 2 },
  slotWide: { alignItems: 'flex-start', paddingHorizontal: 20 },
  slotTitle: { fontFamily: fonts.sans, fontSize: 13.5, color: colors.dark },
  slotSub: { fontFamily: fonts.sans, fontSize: 10.5, color: colors.muted },
});
