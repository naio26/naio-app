import { StyleSheet, View } from 'react-native';
import { colors } from '@/theme';

/** Corner brackets of a camera frame (face check, ID photo). */
export function CornerFrame({
  width,
  height,
  color = colors.white,
  size = 30,
  thickness = 3,
}: {
  width: number | `${number}%`;
  height: number;
  color?: string;
  size?: number;
  thickness?: number;
}) {
  const c = { position: 'absolute' as const, width: size, height: size, borderColor: color };
  return (
    <View pointerEvents="none" style={{ width, height }}>
      <View
        style={[c, { top: 0, left: 0, borderTopWidth: thickness, borderLeftWidth: thickness, borderTopLeftRadius: 8 }]}
      />
      <View
        style={[
          c,
          { top: 0, right: 0, borderTopWidth: thickness, borderRightWidth: thickness, borderTopRightRadius: 8 },
        ]}
      />
      <View
        style={[
          c,
          { bottom: 0, left: 0, borderBottomWidth: thickness, borderLeftWidth: thickness, borderBottomLeftRadius: 8 },
        ]}
      />
      <View
        style={[
          c,
          {
            bottom: 0,
            right: 0,
            borderBottomWidth: thickness,
            borderRightWidth: thickness,
            borderBottomRightRadius: 8,
          },
        ]}
      />
    </View>
  );
}

/** Drawing of an ID card: portrait square and text lines. "light" on dark frames, "dim" for the camera. */
export function IdCardArt({ width = 260, tone = 'light' }: { width?: number; tone?: 'light' | 'dim' | 'mini' }) {
  const t = {
    light: { card: '#F6EDE4', photo: '#DEC5B8', ring: '#8C6A5C', line: '#D6BFB2' },
    dim: { card: '#A3958A', photo: '#73625A', ring: '#73625A', line: '#86766C' },
    mini: { card: '#EFE2D8', photo: '#D3B9AB', ring: '#8C6A5C', line: '#D3B9AB' },
  }[tone];
  const h = width * 0.6;
  return (
    <View
      style={[
        styles.card,
        {
          width,
          height: h,
          padding: width * 0.07,
          gap: width * 0.07,
          backgroundColor: t.card,
          borderRadius: width * 0.05,
        },
      ]}
    >
      <View
        style={[
          styles.photo,
          { width: width * 0.26, height: h * 0.6, backgroundColor: t.photo, borderRadius: width * 0.04 },
        ]}
      >
        {tone !== 'dim' && (
          <View
            style={{
              width: width * 0.11,
              height: width * 0.11,
              borderRadius: width,
              borderWidth: 1.5,
              borderColor: t.ring,
            }}
          />
        )}
      </View>
      <View style={{ flex: 1, gap: h * 0.09, justifyContent: 'center' }}>
        {[1, 0.75, 0.88, 0.55].map((w, i) => (
          <View
            key={i}
            style={{ width: `${w * 100}%`, height: Math.max(4, h * 0.06), borderRadius: 4, backgroundColor: t.line }}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center' },
  photo: { alignItems: 'center', justifyContent: 'center' },
});
