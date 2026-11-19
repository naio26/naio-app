// The real map on the phone (Apple Maps on iPhone, Google Maps on Android): move, pinch to zoom, explore.
// react-native-maps is included in Expo Go, no API key needed there. NaioMap.tsx is the web stand-in.
import { ReactNode } from 'react';
import { Platform, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { MY_AREA } from '@/data/match';

type LatLng = { latitude: number; longitude: number };

// Opens on central Athens around you (the demo position), with every plan and person in view.
const START = {
  latitude: MY_AREA.latitude - 0.002,
  longitude: MY_AREA.longitude - 0.007,
  latitudeDelta: 0.045,
  longitudeDelta: 0.05,
};

export function NaioMap({ children, onPressMap }: { children?: ReactNode; onPressMap?: () => void }) {
  return (
    <MapView
      style={StyleSheet.absoluteFill}
      initialRegion={START}
      showsUserLocation={false} // the demo never reads your real location
      showsPointsOfInterests={false}
      showsCompass={false}
      showsScale={false}
      toolbarEnabled={false}
      pitchEnabled={false}
      rotateEnabled={false}
      onPress={(e) => {
        // Android also sends map presses for marker taps: ignore those.
        if ((e.nativeEvent as { action?: string }).action === 'marker-press') return;
        onPressMap?.();
      }}
    >
      {children}
    </MapView>
  );
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
    <Marker
      coordinate={location}
      onPress={(e) => {
        e.stopPropagation?.();
        onPress?.();
      }}
      accessibilityLabel={label}
      zIndex={z}
      // Android pins by a fraction of the marker, iPhone by an offset from its centre.
      anchor={{ x: 0.5, y: size.anchorY / size.height }}
      centerOffset={Platform.OS === 'ios' ? { x: 0, y: size.height / 2 - size.anchorY } : undefined}
      tracksViewChanges
    >
      {children}
    </Marker>
  );
}
