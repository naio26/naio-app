import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Person } from '@/data/types';
import { colors, fonts, space } from '@/theme';
import { Avatar } from './Avatar';
import { BalancedTags } from './BalancedTags';
import { Icon } from './Icon';
import { Txt } from './Txt';

/**
 * Short profile of someone in a plan (tap their circle in "Who's going"), shown in a BottomSheet.
 * Only the age RANGE and where they're FROM: never an exact age or where they are now.
 */
export function PersonCard({ person, host }: { person: Person; host?: boolean }) {
  const me = person.id === 'me';
  // Room at the bottom so the content doesn't sit on the edge (or under the iPhone's home bar).
  const insets = useSafeAreaInsets();
  const about = person.about?.trim();
  const languages = person.languages.map((l) => l.name).join(' · ');
  const interests = person.interests.slice(0, 4);
  return (
    // A bit of room at the top too (the sheet has no drag line here), about the same as at the bottom.
    <View style={[styles.root, { paddingTop: space.lg, paddingBottom: insets.bottom + space.lg }]}>
      <View style={styles.hero}>
        <Avatar
          initials={person.initials}
          size={72}
          color={me ? colors.accent : person.avatarColor}
          verified={person.verified}
          photo={person.photo}
        />
        <Txt style={styles.name}>{me ? 'You' : person.firstName}</Txt>
        {host && <Txt style={styles.host}>(HOST)</Txt>}
        <Txt style={styles.age}>{person.ageRange}</Txt>
        <FromLine from={person.from} />
      </View>

      {!!about && (
        <View style={styles.block}>
          <Txt style={styles.label}>About me</Txt>
          <Txt style={styles.value} numberOfLines={2}>
            {about}
          </Txt>
        </View>
      )}
      {!!languages && (
        <View style={styles.block}>
          <Txt style={styles.label}>Languages</Txt>
          <Txt style={styles.value}>{languages}</Txt>
        </View>
      )}
      {interests.length > 0 && (
        <View style={styles.block}>
          <Txt style={styles.label}>My kind of plans</Txt>
          <BalancedTags items={interests} align="left" />
        </View>
      )}
    </View>
  );
}

/** "From Barcelona" with a small pin (profile card, and orange people on the map). */
export function FromLine({ from }: { from?: string }) {
  if (!from) return null;
  return (
    <View style={styles.from}>
      <Icon name="map-pin" size={16} color={colors.muted} />
      <Txt style={styles.fromText}>From {from}</Txt>
    </View>
  );
}

/** A titled section ("ABOUT ME", "LANGUAGES", "MY KIND OF PLANS") with a thin sand line on top. */
export function ProfileBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.block}>
      <Txt style={styles.label}>{label}</Txt>
      {typeof children === 'string' ? <Txt style={styles.value}>{children}</Txt> : children}
    </View>
  );
}

/** Text style for what someone wrote about themselves (same size everywhere). */
export const profileText = { fontFamily: fonts.sans, fontSize: 15, lineHeight: 22, color: colors.dark };

const styles = StyleSheet.create({
  root: { gap: space.lg },
  hero: { alignItems: 'center', gap: 4 },
  name: { fontFamily: fonts.serif, fontSize: 30, lineHeight: 36, color: colors.dark, marginTop: space.sm },
  host: { fontFamily: fonts.sansBold, fontSize: 11, letterSpacing: 1, color: colors.accent },
  age: { fontFamily: fonts.sans, fontSize: 15, lineHeight: 21, color: colors.dark },
  from: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  fromText: { fontFamily: fonts.sans, fontSize: 14, lineHeight: 20, color: colors.muted },
  block: { gap: 8, paddingTop: space.lg, borderTopWidth: 1, borderTopColor: colors.border },
  label: {
    fontFamily: fonts.sansBold,
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: colors.muted,
  },
  value: profileText,
});
