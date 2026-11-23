import { useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { colors, fonts } from '@/theme';
import { Txt } from './Txt';

const GAP = 8;

/**
 * Soft outline tags ("My kind of plans") laid out like justified text: every row starts at the left edge and
 * reaches the right edge (items spread evenly); the last row stays on the left. Items may be reordered so rows fill well.
 */
export function BalancedTags({ items }: { items: string[] }) {
  const [width, setWidth] = useState(0);
  const [sizes, setSizes] = useState<Record<string, number>>({});
  const measured = width > 0 && items.every((i) => sizes[i] !== undefined);
  const rows = measured ? fillRows(items, sizes, width) : [];

  return (
    <View onLayout={(e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width)}>
      {/* Invisible copy, only to measure each tag's width. */}
      {!measured && (
        <View style={styles.measure} pointerEvents="none">
          {items.map((i) => (
            <View
              key={i}
              onLayout={(e) => {
                const w = e.nativeEvent.layout.width;
                setSizes((s) => (s[i] === w ? s : { ...s, [i]: w }));
              }}
            >
              <Tag label={i} />
            </View>
          ))}
        </View>
      )}
      <View style={{ gap: GAP }}>
        {rows.map((row, r) => (
          <View key={r} style={[styles.row, r < rows.length - 1 && row.length > 1 && styles.justified]}>
            {row.map((i) => (
              <Tag key={i} label={i} />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

function Tag({ label }: { label: string }) {
  return (
    <View style={styles.tag}>
      <Txt numberOfLines={1} style={styles.text}>
        {label}
      </Txt>
    </View>
  );
}

/**
 * Fill each row as full as possible (best combination of the remaining tags, so the justified gaps stay small);
 * whatever is left becomes the last row. Inside a row the original order is kept.
 */
function fillRows(items: string[], sizes: Record<string, number>, max: number): string[][] {
  const rows: string[][] = [];
  let left = [...items];
  while (left.length) {
    let best: string[] = [left[0]];
    let bestW = -1;
    // At most 8 interests, so trying every combination is instant.
    for (let mask = 1; mask < 1 << left.length; mask++) {
      const pick = left.filter((_, i) => mask & (1 << i));
      const w = pick.reduce((t, i) => t + sizes[i], 0) + GAP * (pick.length - 1);
      if (w <= max && (w > bestW || (w === bestW && pick.length > best.length))) {
        best = pick;
        bestW = w;
      }
    }
    rows.push(best);
    left = left.filter((i) => !best.includes(i));
  }
  return rows;
}

const styles = StyleSheet.create({
  measure: { position: 'absolute', opacity: 0, flexDirection: 'row', alignItems: 'flex-start' },
  row: { flexDirection: 'row', justifyContent: 'flex-start', gap: GAP },
  justified: { justifyContent: 'space-between' },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
  },
  text: { fontFamily: fonts.sans, fontSize: 14, lineHeight: 19, color: colors.dark },
});
