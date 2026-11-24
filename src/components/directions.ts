import { Alert, Linking, Platform } from "react-native";

/**
 * Tapping the exact meeting point: choose a maps app for directions.
 * iPhone: Apple Maps, Google Maps or Waze (each opens its app if installed, otherwise the website).
 * Android: Google Maps, or "Other maps app" (the phone shows every installed maps app).
 */
export function openDirections(place: string) {
  const q = encodeURIComponent(place);
  const open = (url: string, fallback?: string) =>
    Linking.openURL(url).catch(() =>
      fallback ? Linking.openURL(fallback) : undefined,
    );
  const google = () =>
    open(`https://www.google.com/maps/dir/?api=1&destination=${q}`);
  const buttons =
    Platform.OS === "ios"
      ? [
          {
            text: "Apple Maps",
            onPress: () => open(`http://maps.apple.com/?daddr=${q}`),
          },
          { text: "Google Maps", onPress: google },
          {
            text: "Waze",
            onPress: () => open(`https://waze.com/ul?q=${q}&navigate=yes`),
          },
        ]
      : [
          { text: "Google Maps", onPress: google },
          { text: "Other maps app", onPress: () => open(`geo:0,0?q=${q}`) },
        ];
  Alert.alert("Get directions", place, [
    ...buttons,
    { text: "Cancel", style: "cancel" as const },
  ]);
}
