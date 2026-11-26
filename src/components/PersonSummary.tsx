import { useState } from 'react';
import { View } from 'react-native';
import { availabilityText } from '@/data/catalog';
import { Person } from '@/data/types';
import { colors, space } from '@/theme';
import { BalancedTags } from './BalancedTags';
import { FromLine, ProfileBlock, profileText } from './PersonCard';
import { Txt } from './Txt';

/**
 * Someone's profile in the "open to plans" card style (map card 28 and join requests 40–41):
 * a small label, name + age range, stay and availability (if they're open to plans), "From …",
 * the short description, then "MY KIND OF PLANS" and "LANGUAGES". No flags anywhere.
 */
const lineStyle = { fontSize: 14 };

/** "In Athens for 4 days · Available now" if it fits on one line, else the two parts on two lines. */
function StayLine({ stay, available }: { stay: string; available: string }) {
  const [room, setRoom] = useState(0);
  const [needed, setNeeded] = useState(0);
  const oneLine = room > 0 && needed > 0 && needed <= room;
  return (
    <View onLayout={(e) => setRoom(e.nativeEvent.layout.width)}>
      {oneLine ? (
        <Txt variant="small" numberOfLines={1} style={lineStyle}>
          {stay} · {available}
        </Txt>
      ) : (
        <View style={!needed && { opacity: 0 }}>
          <Txt variant="small" style={lineStyle}>
            {stay}
          </Txt>
          <Txt variant="small" style={lineStyle}>
            {available}
          </Txt>
        </View>
      )}
      {/* Off-screen copy of the one-line version, only to measure it. */}
      <View style={{ position: 'absolute', left: 0, top: 0, width: 2000, opacity: 0 }} pointerEvents="none">
        <Txt
          variant="small"
          numberOfLines={1}
          style={[lineStyle, { alignSelf: 'flex-start' }]}
          onLayout={(e) => setNeeded(Math.ceil(e.nativeEvent.layout.width))}
        >
          {stay} · {available}
        </Txt>
      </View>
    </View>
  );
}

export function PersonSummary({
  person,
  eyebrow,
  eyebrowColor = colors.accent,
}: {
  person: Person;
  eyebrow?: string;
  eyebrowColor?: string;
}) {
  const a = person.available;
  const about = person.about?.trim();
  return (
    <View style={{ gap: space.lg }}>
      <View style={{ gap: 8 }}>
        {!!eyebrow && (
          <Txt variant="eyebrow" style={{ letterSpacing: 1.2, color: eyebrowColor }}>
            {eyebrow}
          </Txt>
        )}
        <Txt variant="h1">
          {person.firstName}, {person.ageRange}
        </Txt>
        {/* Stay · availability on one line when it fits; otherwise the availability goes on its own line below. */}
        {a && <StayLine stay={a.stay} available={availabilityText(a)} />}
        <FromLine from={person.from} strong />
      </View>
      {!!about && <Txt style={profileText}>{about}</Txt>}
      {person.interests.length > 0 && (
        <ProfileBlock label="My kind of plans">
          <BalancedTags items={person.interests} align="left" />
        </ProfileBlock>
      )}
      {person.languages.length > 0 && (
        <ProfileBlock label="Languages">{person.languages.map((l) => l.name).join(' · ')}</ProfileBlock>
      )}
    </View>
  );
}
