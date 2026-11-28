// Web version (browser tests only): the real map (react-native-maps) doesn't run on the web,
// so this shows the drawn map with the same markers. On the phone, NaioMap.native.tsx is used.
import { ReactNode } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { FakeMap, project } from './FakeMap';

type LatLng = { latitude: number; longitude: number };

export function NaioMap({ children, onPressMap }: { children?: ReactNode; onPressMap?: () => void }) {
  return <FakeMap onPressMap={onPressMap}>{children}</FakeMap>;
}

/** A marker pinned to a coordinate. `size.anchorY` = px from the top of the marker to its point. */
export function MapMarker({
  location,
  size,
  onPress,
  label,
  z = 1,
  children,
}: {
  location: LatLng;
  size: { height: number; anchorY: number };
  onPress?: () => void;
  label?: string;
  z?: number;
  children: ReactNode;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={[styles.marker, project(location), { marginTop: -size.anchorY, zIndex: z }]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  marker: { position: 'absolute', width: 160, marginLeft: -80, alignItems: 'center' },
});
