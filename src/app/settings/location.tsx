import { View } from 'react-native';
import { InfoBox, OptionRow, Screen, ScreenHeader } from '@/components';
import { LocationMode, useSafety } from '@/state/safety';
import { space } from '@/theme';

const options: { mode: LocationMode; label: string }[] = [
  { mode: 'approximate', label: 'Approximate area while active' },
  { mode: 'hidden-until-joined', label: 'Only when I join or host a plan' },
];

export default function LocationVisibility() {
  const { locationMode, setLocationMode } = useSafety();
  return (
    <Screen
      scroll
      header={<ScreenHeader eyebrow="Privacy" title="Location visibility" />}
      contentStyle={{ paddingTop: space.xl, gap: space.xl }}
    >
      <View>
        {options.map((o) => (
          <OptionRow
            key={o.mode}
            label={o.label}
            selected={locationMode === o.mode}
            onPress={() => setLocationMode(o.mode)}
          />
        ))}
      </View>
      <InfoBox
        title="Your exact location is never shown"
        text="Others only see a rough area, never where you are exactly. The exact meeting point is shared only inside a plan."
      />
    </Screen>
  );
}
