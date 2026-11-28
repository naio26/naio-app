import { useState } from 'react';
import { StyleProp, TextStyle, View } from 'react-native';
import { Txt } from './Txt';

/**
 * A plan's languages on ONE line: as many as fit, then "+N" for the rest ("English · Greek +1").
 * Each possible line is measured off-screen, then the longest one that fits is shown.
 * The full list is on plan details.
 */
export function FitLanguages({ languages, style }: { languages: string[]; style?: StyleProp<TextStyle> }) {
  const [room, setRoom] = useState(0);
  const [widths, setWidths] = useState<Record<number, number>>({});
  const lineFor = (k: number) => languages.slice(0, k).join(' · ') + (k < languages.length ? ` +${languages.length - k}` : '');
  const counts = languages.map((_, i) => languages.length - i); // n, n-1, …, 1
  const measured = counts.every((k) => widths[k] !== undefined);
  const k = measured && room ? (counts.find((c) => widths[c] <= room) ?? 1) : languages.length;
  return (
    <View style={{ flex: 1 }} onLayout={(e) => setRoom(e.nativeEvent.layout.width)}>
      <Txt numberOfLines={1} style={[style, !measured && { opacity: 0 }]}>
        {lineFor(k)}
      </Txt>
      {/* Off-screen copies, only to measure how wide each line would be. */}
      <View style={{ position: 'absolute', left: 0, top: 0, width: 2000, opacity: 0 }} pointerEvents="none">
        {counts.map((c) => (
          <Txt
            key={c}
            numberOfLines={1}
            style={[style, { alignSelf: 'flex-start' }]}
            onLayout={(e) => {
              const w = Math.ceil(e.nativeEvent.layout.width);
              setWidths((m) => (m[c] === w ? m : { ...m, [c]: w }));
            }}
          >
            {lineFor(c)}
          </Txt>
        ))}
      </View>
    </View>
  );
}
