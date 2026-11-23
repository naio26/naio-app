import { useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { colors, fonts } from '@/theme';
import { Txt } from './Txt';

const GAP = 8;

/**
 * Soft outline tags ("My kind of plans") laid out in balanced rows: as few rows as fit,
 * rows of about the same width (items may be reordered for that), each row centred. No big gaps.
 */
export function BalancedTags({ items }: { items: string[] }) {
  const [width, setWidth] = useState(0);
  const [sizes, setSizes] = useState<Record<string, number>>({});
  const measured = width > 0 && items.every((i) => sizes[i] !== undefined);
  const rows = measured ? balance(items, sizes, width) : [];

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
          <View key={r} style={styles.row}>
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

/** Fewest rows that fit; within them, put each tag (widest first) on the shortest row it fits in. */
function balance(items: string[], sizes: Record<string, number>, max: number): string[][] {
  const sorted = [...items].sort((a, b) => sizes[b] - sizes[a]);
  for (let count = 1; count <= items.length; count++) {
    const rows: { items: string[]; w: number }[] = Array.from({ length: count }, () => ({ items: [], w: 0 }));
    let ok = true;
    for (const it of sorted) {
      const need = (row: { items: string[]; w: number }) => row.w + (row.items.length ? GAP : 0) + sizes[it];
      const fits = rows.filter((row) => need(row) <= max).sort((a, b) => a.w - b.w);
      if (!fits.length) {
        ok = false;
        break;
      }
      fits[0].w = need(fits[0]);
      fits[0].items.push(it);
    }
    if (ok) {
      // Keep the original order inside each row where possible, and the fullest rows first.
      return rows
        .filter((r) => r.items.length)
        .sort((a, b) => b.w - a.w)
        .map((r) => items.filter((i) => r.items.includes(i)));
    }
  }
  return items.map((i) => [i]);
}

const styles = StyleSheet.create({
  measure: { position: 'absolute', opacity: 0, flexDirection: 'row', alignItems: 'flex-start' },
  row: { flexDirection: 'row', justifyContent: 'center', gap: GAP },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
  },
  text: { fontFamily: fonts.sans, fontSize: 14, lineHeight: 19, color: colors.dark },
});
