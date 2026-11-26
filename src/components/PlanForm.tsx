import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Icon, type IconName } from './Icon';
import { DEFAULT_DURATION, DURATIONS, MAX_GROUP, MAX_SPOTS, MIN_SPOTS, MOODS } from '@/data/catalog';
import { useCity } from '@/state/city';
import { formatTime, nowHHMM, planWhen, plansOverlap, timeOptions, toMinutes } from '@/data/time';
import { usePlans } from '@/state/plans';
import { Plan, PlanDay, PlanDraft } from '@/data/types';
import { colors, fonts, radius, space } from '@/theme';
import { BackButton } from './BackButton';
import { Button } from './Button';
import { Chip } from './Chip';
import { Input } from './Input';
import { LanguagePicker } from './LanguagePicker';
import { Screen } from './Screen';
import { Txt } from './Txt';

const MAX_MOODS = 3;

/** "an activity", "an activity and a mood", "an activity, a time and a mood". */
const listText = (items: string[]) =>
  items.length < 2 ? (items[0] ?? '') : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;

export function emptyDraft(): PlanDraft {
  return {
    title: '',
    day: 'today',
    time: timeOptions('today')[1] ?? timeOptions('tomorrow')[0],
    duration: DEFAULT_DURATION,
    spots: 5,
    languages: ['English'],
    area: '',
    exactPoint: '',
    note: '',
    moods: [],
  };
}

export function draftFromPlan(p: Plan): PlanDraft {
  return {
    title: p.title,
    day: p.day,
    time: p.time,
    duration: p.durationH ?? DEFAULT_DURATION,
    spots: Math.min(p.capacity - 1, MAX_SPOTS),
    languages: p.languages,
    area: p.area,
    exactPoint: p.exactPoint,
    note: p.description,
    moods: p.moods,
  };
}

/** The form behind "Create a plan" (29) and "Edit plan" (32). */
export function PlanForm({
  planId,
  title,
  initial,
  submitLabel,
  minSpots = MIN_SPOTS,
  onSubmit,
}: {
  title: string;
  initial: PlanDraft;
  submitLabel: string;
  /** When editing, you can't go below the people already in. */
  minSpots?: number;
  /** When editing: the plan itself (so it doesn't "overlap" with itself). */
  planId?: string;
  onSubmit: (d: PlanDraft) => Promise<void>;
}) {
  const [d, setD] = useState<PlanDraft>(initial);
  // Your other plans at the same time (in, hosting or asked to join), using each plan's duration.
  const { plans, statusOf } = usePlans();
  const asPlan = { day: d.day, time: d.time, durationH: d.duration } as Plan;
  const clash = plans.find((p) => p.id !== planId && statusOf(p) !== 'none' && plansOverlap(asPlan, p));
  const city = useCity();
  // "Now": today, starting at the current time (no time to pick).
  const [now, setNow] = useState(false);
  const [saving, setSaving] = useState(false);
  const set = (c: Partial<PlanDraft>) => setD((x) => ({ ...x, ...c }));
  const times = useMemo(() => {
    const list = timeOptions(d.day);
    // Keep an existing time visible when editing, even if it's no longer offered.
    return list.includes(d.time) ? list : [d.time, ...list].sort();
  }, [d.day, d.time]);

  const setDay = (day: PlanDay) => {
    setNow(false);
    const list = timeOptions(day);
    set({ day, time: list.includes(d.time) ? d.time : list[0] });
  };
  // "Now": it ends after the chosen duration ("4 h+" just says the start).
  const endTime =
    d.duration >= 4
      ? 'later, 4 h+'
      : formatTime(
          `${String(Math.floor(((toMinutes(d.time) + d.duration * 60) % 1440) / 60)).padStart(2, '0')}:${String(
            (toMinutes(d.time) + d.duration * 60) % 60,
          ).padStart(2, '0')}`,
        );
  const startNow = () => {
    setNow(true);
    set({ day: 'today', time: nowHHMM() });
  };

  const missing = [
    !d.title.trim() && 'an activity',
    !d.time && 'a time',
    !d.exactPoint.trim() && 'a meeting point',
    d.languages.length === 0 && 'a language',
    d.moods.length === 0 && 'a mood',
  ].filter(Boolean) as string[];

  const submit = async () => {
    setSaving(true);
    await onSubmit(d);
    setSaving(false);
  };

  return (
    <Screen
      scroll
      contentStyle={styles.content}
      footer={
        <View style={{ gap: 8 }}>
          {missing.length > 0 && (
            <Txt variant="caption" center>
              Add {listText(missing)} to continue.
            </Txt>
          )}
          <Button title={submitLabel} arrow disabled={missing.length > 0} loading={saving} onPress={submit} />
        </View>
      }
    >
      <View>
        <BackButton />
      </View>
      <Txt variant="h1">{title}</Txt>

      <Field label="Activity">
        <Input
          placeholder="Coffee and a wander?"
          value={d.title}
          onChangeText={(t) => set({ title: t })}
          maxLength={50}
          autoCapitalize="sentences"
        />
      </Field>

      <Field label="Day / time" hint={now ? `Starts now · until ${endTime}` : undefined}>
        <View style={styles.row}>
          <Chip label="Now" selected={now} onPress={startNow} />
          {(['today', 'tomorrow'] as const).map((day) => (
            <Chip
              key={day}
              label={day === 'today' ? 'Today' : 'Tomorrow'}
              selected={!now && d.day === day}
              onPress={() => setDay(day)}
            />
          ))}
        </View>
        {!now && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.times}>
            {times.map((t) => (
              <Chip key={t} size="sm" label={formatTime(t)} selected={d.time === t} onPress={() => set({ time: t })} />
            ))}
          </ScrollView>
        )}
      </Field>

      <Field label="Duration" sub="How long the plan lasts.">
        <View style={styles.row}>
          {DURATIONS.map((o) => (
            <Chip
              key={o.hours}
              size="sm"
              label={o.label}
              selected={d.duration === o.hours}
              onPress={() => set({ duration: o.hours })}
            />
          ))}
        </View>
        {/* Heads-up when it happens at the same time as another plan of yours. */}
        {clash && (
          <Txt variant="caption" color={colors.accent}>
            Overlaps with “{clash.title}” ({planWhen(clash)}).
          </Txt>
        )}
      </Field>

      <Field label="Spots" hint={`Up to ${MAX_GROUP} people in total, you included.`}>
        <View style={styles.spots}>
          <Stepper
            value={d.spots}
            min={Math.max(MIN_SPOTS, minSpots)}
            max={MAX_SPOTS}
            onChange={(spots) => set({ spots })}
          />
          <Txt variant="small" style={{ flex: 1 }}>
            {d.spots === 1 ? 'person can join' : 'people can join'}, besides you
          </Txt>
        </View>
      </Field>

      <Field label="Languages" sub="Pick one or more languages.">
        {/* Same as Filters → Language: the city's suggested languages, then "+ Add another language". */}
        <LanguagePicker size="sm" selected={d.languages} onChange={(languages) => set({ languages })} />
      </Field>

      <Field
        label="Area (optional)"
        hint={`Neighbourhoods of ${city.name}. Everyone sees the area. Without choosing one, people will see just ${city.name}.`}
      >
        <View style={styles.wrap}>
          {/* Neighbourhoods of the city you're in (from the current city, never typed here). Tap again to clear. */}
          {city.areas.map((a) => (
            <Chip
              key={a.name}
              size="sm"
              label={a.name}
              selected={d.area === a.name}
              onPress={() => set({ area: d.area === a.name ? '' : a.name })}
            />
          ))}
        </View>
      </Field>

      <Field label="Meeting point" hint="Only shared with the people you accept.">
        <Input
          placeholder="Monastiraki Square, by the metro exit"
          value={d.exactPoint}
          onChangeText={(t) => set({ exactPoint: t })}
          maxLength={70}
        />
      </Field>

      <Field label="Mood" hint={`Pick up to ${MAX_MOODS}. It helps the right people find your plan.`}>
        <View style={styles.wrap}>
          {MOODS.map((m) => {
            const on = d.moods.includes(m);
            const full = !on && d.moods.length >= MAX_MOODS;
            return (
              <Chip
                key={m}
                size="sm"
                label={m}
                selected={on}
                style={full && { opacity: 0.45 }}
                onPress={() => !full && set({ moods: on ? d.moods.filter((x) => x !== m) : [...d.moods, m] })}
              />
            );
          })}
        </View>
      </Field>

      <Field label="Description">
        <Input
          placeholder="Coffee first, then a wander if we feel like it."
          value={d.note}
          onChangeText={(t) => set({ note: t })}
          maxLength={140}
          multiline
          style={styles.note}
        />
      </Field>

    </Screen>
  );
}

function Field({
  label,
  sub,
  hint,
  children,
}: {
  label: string;
  /** A short line right under the title. */
  sub?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <View style={{ gap: 10 }}>
      <View style={{ gap: 4 }}>
        <Txt style={styles.label}>{label}</Txt>
        {sub && <Txt variant="caption">{sub}</Txt>}
      </View>
      {children}
      {hint && <Txt variant="caption">{hint}</Txt>}
    </View>
  );
}

function Stepper({
  value,
  min,
  max,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <View style={styles.stepper}>
      <Pressable
        accessibilityLabel="Fewer spots"
        disabled={value <= min}
        onPress={() => onChange(value - 1)}
        style={styles.stepBtn}
      >
        <Icon name="minus" color={value <= min ? colors.faint : colors.accent} />
      </Pressable>
      <Txt variant="bodyStrong" style={{ minWidth: 24, textAlign: 'center', fontSize: 18 }}>
        {value}
      </Txt>
      <Pressable
        accessibilityLabel="More spots"
        disabled={value >= max}
        onPress={() => onChange(value + 1)}
        style={styles.stepBtn}
      >
        <Icon name="plus" color={value >= max ? colors.faint : colors.accent} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: space.lg, paddingBottom: space.xl, gap: space.xl },
  label: {
    fontFamily: fonts.sansBold,
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: colors.muted,
  },
  row: { flexDirection: 'row', gap: 10 },
  times: { gap: 8, paddingRight: space.lg },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  spots: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: 4,
  },
  stepBtn: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  note: { height: 84, paddingTop: 14, textAlignVertical: 'top' },
});
