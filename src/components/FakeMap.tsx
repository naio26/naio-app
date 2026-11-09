import { Pressable, StyleSheet, View } from 'react-native';
import { colors, fonts } from '@/theme';
import { Txt } from './Txt';

type LatLng = { latitude: number; longitude: number };

// The drawn map shows central Athens. These bounds turn coordinates into % positions.
const BOUNDS = { west: 23.704, east: 23.752, north: 37.985, south: 37.962 };
const TOP = 16; // % kept free for the greeting card
const BOTTOM = 84; // % kept free above the sheet/tab bar

export function project({ latitude, longitude }: LatLng) {
  const x = ((longitude - BOUNDS.west) / (BOUNDS.east - BOUNDS.west)) * 100;
  const y = TOP + ((BOUNDS.north - latitude) / (BOUNDS.north - BOUNDS.south)) * (BOTTOM - TOP);
  return { left: `${x}%` as const, top: `${y}%` as const };
}

/** You, approximately (Syntagma). The real location is never shown to anyone. */
export const MY_AREA: LatLng = { latitude: 37.9755, longitude: 23.7348 };

const parks = [
  { name: 'Lycabettus', x: 86, y: 26, w: 190, h: 170 },
  { name: 'National Garden', x: 72, y: 56, w: 120, h: 150 },
  { name: 'Philopappou', x: 22, y: 74, w: 190, h: 180 },
];
const hills = [{ name: 'Acropolis', x: 40, y: 60, w: 120, h: 76 }];
const roads = [
  { top: 30, rotate: 14 },
  { top: 48, rotate: -24 },
  { top: 66, rotate: 9 },
  { top: 80, rotate: -12 },
  { top: 52, rotate: 62 },
];
const areas = [
  { name: 'Kolonaki', x: 82, y: 51 },
  { name: 'Plaka', x: 48, y: 69 },
  { name: 'Koukaki', x: 46, y: 84 },
  { name: 'Psyrri', x: 33, y: 44 },
  { name: 'Monastiraki', x: 5, y: 41 },
];

/** A hand-drawn style map of central Athens. Pins go on top as children. */
export function FakeMap({ children, onPressMap }: { children?: React.ReactNode; onPressMap?: () => void }) {
  return (
    <View style={styles.map}>
      <Pressable accessibilityLabel="Map of Athens" onPress={onPressMap} style={StyleSheet.absoluteFill}>
        {parks.map((p) => (
          <View key={p.name} style={[styles.blob, styles.park, blob(p)]} />
        ))}
        {hills.map((p) => (
          <View key={p.name} style={[styles.blob, styles.hill, blob(p)]}>
            <Txt style={styles.hillName}>{p.name}</Txt>
          </View>
        ))}
        {roads.map((r, i) => (
          <View key={i} style={[styles.road, { top: `${r.top}%`, transform: [{ rotate: `${r.rotate}deg` }] }]} />
        ))}
        {areas.map((a) => (
          <Txt key={a.name} style={[styles.area, { left: `${a.x}%`, top: `${a.y}%` }]}>
            {a.name}
          </Txt>
        ))}
        <Txt style={styles.city}>Athens</Txt>
      </Pressable>
      {children}
    </View>
  );
}

const blob = (p: { x: number; y: number; w: number; h: number }) => ({
  left: `${p.x}%` as const,
  top: `${p.y}%` as const,
  width: p.w,
  height: p.h,
  marginLeft: -p.w / 2,
  marginTop: -p.h / 2,
});

/** The blue "You · approximate" dot. */
export function YouMarker() {
  return (
    <View pointerEvents="none" style={[styles.youWrap, project(MY_AREA)]}>
      <View style={styles.halo}>
        <View style={styles.dot} />
      </View>
      <View style={styles.youTag}>
        <Txt style={styles.youText}>You · approximate</Txt>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.mapLand,
    overflow: 'hidden',
  },
  blob: { position: 'absolute', borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  park: { backgroundColor: colors.mapPark },
  hill: { backgroundColor: colors.mapHill },
  hillName: { fontFamily: fonts.sansBold, fontSize: 11, color: colors.mapLabel },
  road: {
    position: 'absolute',
    left: '-30%',
    width: '160%',
    height: 9,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#DDD6CC',
  },
  area: { position: 'absolute', fontFamily: fonts.sansBold, fontSize: 12, color: colors.mapLabel, letterSpacing: 0.4 },
  city: {
    position: 'absolute',
    top: '19%',
    alignSelf: 'center',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontFamily: fonts.sansBold,
    fontSize: 19,
    color: colors.mapLabel,
  },
  youWrap: { position: 'absolute', marginLeft: -28, marginTop: -28, flexDirection: 'row', alignItems: 'center' },
  halo: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.youHalo,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.you,
    borderWidth: 3,
    borderColor: colors.white,
  },
  youTag: {
    marginLeft: 4,
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#9CC3DF',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  youText: { fontFamily: fonts.sansBold, fontSize: 11, color: colors.you },
});
