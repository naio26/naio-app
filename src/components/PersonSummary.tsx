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
        {/* Stay, then the availability on its own line (both from the person's data). */}
        {a && (
          <View>
            <Txt variant="small" style={{ fontSize: 14 }}>
              {a.stay}
            </Txt>
            <Txt variant="small" style={{ fontSize: 14 }}>
              {availabilityText(a)}
            </Txt>
          </View>
        )}
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
