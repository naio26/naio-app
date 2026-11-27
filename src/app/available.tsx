import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Button, goBack, Icon, Screen, ScreenHeader, Txt } from '@/components';
import { availabilityText, DAY_SLOTS, hasAvailability } from '@/data/catalog';
import { daySlotAt, demoNow } from '@/data/time';
import { Availability, DaySlot, PlanDay } from '@/data/types';
import { useProfile } from '@/state/profile';
import { colors, fonts, radius, space } from '@/theme';

const ORDER: DaySlot[] = ['morning', 'afternoon', 'evening'];
const DAYS: { key: PlanDay; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: 'tomorrow', label: 'Tomorrow' },
];
const NONE: Availability = { now: false, today: [], tomorrow: [] };

// Not in the designs (same style): you mark yourself as open to plans, from My profile.
// Now and/or any parts of today and tomorrow, several at once. Saved in your profile.
// The owner chose A: "Now" on top, then a grid of Today / Tomorrow × Morning / Afternoon / Evening.
export default function OpenToPlans() {
  const { profile, update } = useProfile();
  const current = profile.available;
  const [draft, setDraft] = useState<Availability>(current ?? NONE);

  // Today, the parts of the day that are already over can't be picked (the demo clock is 4:18 PM).
  const nowSlot = ORDER.indexOf(daySlotAt(demoNow().minutes));
  const isPast = (day: PlanDay, s: DaySlot) => day === 'today' && ORDER.indexOf(s) < nowSlot;
  const choice: Availability = { ...draft, today: draft.today.filter((s) => !isPast('today', s)) };
  const ready = hasAvailability(choice);

  const toggleNow = () => setDraft((d) => ({ ...d, now: !d.now }));
  const toggle = (day: PlanDay, s: DaySlot) =>
    setDraft((d) => ({
      ...d,
      [day]: d[day].includes(s) ? d[day].filter((x) => x !== s) : ORDER.filter((o) => o === s || d[day].includes(o)),
    }));

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
            disabled={!ready}
            onPress={() => {
              if (!ready) return;
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
        <View style={{ gap: 4 }}>
          <Txt variant="question">When are you free?</Txt>
          <Txt variant="caption">Pick as many as you like.</Txt>
        </View>
        <Grid draft={draft} isPast={isPast} onNow={toggleNow} onSlot={toggle} />
      </View>

      {/* The result on one line (wraps to a second one only if it doesn't fit). */}
      {ready && (
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

type PickerProps = {
  draft: Availability;
  isPast: (day: PlanDay, s: DaySlot) => boolean;
  onNow: () => void;
  onSlot: (day: PlanDay, s: DaySlot) => void;
};

/** "Now" on top, then a grid of Today / Tomorrow × Morning / Afternoon / Evening. */
function Grid({ draft, isPast, onNow, onSlot }: PickerProps) {
  return (
    <View style={{ gap: 12 }}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ selected: draft.now }}
        onPress={onNow}
        style={[styles.cell, styles.nowCell, draft.now && styles.cellOn]}
      >
        <Txt style={[styles.cellTitle, draft.now && styles.cellTitleOn]}>Now</Txt>
        {draft.now && <Icon name="check" size={16} color={colors.accent} />}
      </Pressable>

      <View style={{ gap: 8 }}>
        <View style={styles.gridRow}>
          <View style={styles.dayCol} />
          {DAY_SLOTS.map((s) => (
            <View key={s.key} style={styles.head}>
              <Txt style={styles.headTitle}>{s.title}</Txt>
              <Txt style={styles.headSub}>{s.sub}</Txt>
            </View>
          ))}
        </View>
        {DAYS.map((d) => (
          <View key={d.key} style={styles.gridRow}>
            <Txt style={[styles.dayCol, styles.dayLabel]}>{d.label}</Txt>
            {DAY_SLOTS.map((s) => {
              if (isPast(d.key, s.key))
                // Already over today: an empty dashed box, can't be picked.
                return <View key={s.key} style={[styles.cell, styles.gridCell, styles.cellPast]} />;
              const on = draft[d.key].includes(s.key);
              return (
                <Pressable
                  key={s.key}
                  accessibilityRole="button"
                  accessibilityLabel={`${d.label} ${s.title.toLowerCase()}`}
                  accessibilityState={{ selected: on }}
                  onPress={() => onSlot(d.key, s.key)}
                  style={[styles.cell, styles.gridCell, on && styles.cellOn]}
                >
                  {on && <Icon name="check" size={18} color={colors.accent} />}
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: space.xl, gap: space.xl },
  section: { gap: 16 },
  cell: {
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellOn: { backgroundColor: colors.accentSoft, borderColor: colors.accentLine },
  cellPast: { backgroundColor: 'transparent', borderStyle: 'dashed' },
  nowCell: { height: 48, flexDirection: 'row', gap: 8 },
  cellTitle: { fontFamily: fonts.sans, fontSize: 14, color: colors.dark },
  cellTitleOn: { fontFamily: fonts.sansBold, color: colors.accent },
  gridRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  gridCell: { flex: 1, height: 48 },
  dayCol: { width: 72 },
  dayLabel: { fontFamily: fonts.sansBold, fontSize: 14, color: colors.dark },
  head: { flex: 1, alignItems: 'center', gap: 1 },
  headTitle: { fontFamily: fonts.sans, fontSize: 13, color: colors.dark },
  headSub: { fontFamily: fonts.sans, fontSize: 11, color: colors.muted },
  preview: { gap: 4, paddingTop: space.lg, borderTopWidth: 1, borderTopColor: colors.border },
});
