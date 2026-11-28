import { useMemo, useRef, useState } from 'react';
import { LayoutChangeEvent, PanResponder, StyleSheet, View } from 'react-native';
import { colors, fonts, shadow } from '@/theme';
import { Txt } from './Txt';

const THUMB = 28;

/**
 * Two handles on one line that snap to fixed steps (the official age ranges in the filters).
 * `value` = [from, to] indexes into `steps`, both included; the handles can sit on the same step.
 */
export function RangeSlider({
  steps,
  value,
  onChange,
}: {
  steps: readonly string[];
  value: [number, number];
  onChange: (v: [number, number]) => void;
}) {
  const [width, setWidth] = useState(0);
  const last = steps.length - 1;
  const gap = width > 0 ? width / last : 0;

  // The gestures are created once, so they read the latest values from refs.
  const live = useRef({ value, gap, onChange, start: 0 });
  live.current.value = value;
  live.current.gap = gap;
  live.current.onChange = onChange;

  const handle = (which: 0 | 1) =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false, // don't let the page scroll steal it
      onPanResponderGrant: () => {
        live.current.start = live.current.value[which] * live.current.gap;
      },
      onPanResponderMove: (_, g) => {
        const { value: v, gap: step, start } = live.current;
        if (!step) return;
        let i = Math.round((start + g.dx) / step);
        i = Math.max(0, Math.min(last, i));
        // The left handle can't pass the right one, and the other way round.
        const next: [number, number] = which === 0 ? [Math.min(i, v[1]), v[1]] : [v[0], Math.max(i, v[0])];
        if (next[0] !== v[0] || next[1] !== v[1]) live.current.onChange(next);
      },
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handles = useMemo(() => [handle(0), handle(1)], [last]);

  const x = (i: number) => i * gap;
  return (
    <View>
      <View
        style={styles.track}
        onLayout={(e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width - THUMB)}
        accessibilityRole="adjustable"
        accessibilityLabel={`Age range ${steps[value[0]]} to ${steps[value[1]]}`}
      >
        <View style={styles.line} />
        <View
          style={[styles.line, styles.lineOn, { left: THUMB / 2 + x(value[0]), width: x(value[1]) - x(value[0]) }]}
        />
        {steps.map((s, i) => (
          <View
            key={s}
            style={[styles.tick, { left: THUMB / 2 + x(i) - 3 }, i >= value[0] && i <= value[1] && styles.tickOn]}
          />
        ))}
        {width > 0 &&
          ([0, 1] as const).map((w) => (
            <View
              key={w}
              {...handles[w].panHandlers}
              hitSlop={14}
              style={[styles.thumb, { left: x(value[w]) }, w === 1 && value[0] === value[1] && { zIndex: 2 }]}
            />
          ))}
      </View>
      <View style={styles.labels}>
        {steps.map((s, i) => {
          const on = i >= value[0] && i <= value[1];
          return (
            <Txt key={s} style={[styles.label, { left: x(i) + THUMB / 2 - 24 }, on && styles.labelOn]}>
              {s}
            </Txt>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: { height: THUMB, justifyContent: 'center' },
  line: {
    position: 'absolute',
    left: THUMB / 2,
    right: THUMB / 2,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
  },
  lineOn: { right: undefined, backgroundColor: colors.accentFill },
  tick: { position: 'absolute', width: 6, height: 6, borderRadius: 3, backgroundColor: colors.border },
  tickOn: { backgroundColor: colors.accentFill },
  thumb: {
    position: 'absolute',
    width: THUMB,
    height: THUMB,
    borderRadius: THUMB / 2,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.accentFill,
    ...shadow.soft,
  },
  labels: { height: 20, marginTop: 8 },
  label: {
    position: 'absolute',
    width: 48,
    textAlign: 'center',
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.muted,
  },
  labelOn: { fontFamily: fonts.sansBold, color: colors.accent },
});
