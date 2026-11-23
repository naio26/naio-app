import { StyleSheet, View } from 'react-native';
import { Icon, type IconName } from './Icon';
import { MyProfile } from '@/data/types';
import { colors, fonts, shadow, space } from '@/theme';
import { Button } from './Button';
import { Card } from './Card';
import { BalancedTags } from './BalancedTags';
import { ProfilePhoto } from './ProfilePhoto';
import { Txt } from './Txt';

/** Your profile as other people see it: preview (20) and Profile tab (42). */
export function ProfileView({ profile, onEdit }: { profile: MyProfile; onEdit: () => void }) {
  // Where you're FROM (optional, asked in "Add more about you"). We don't show where you are now.
  const from = profile.from.trim();
  return (
    <>
      <View style={styles.hero}>
        <ProfilePhoto name={profile.firstName} size={150} />
        <Txt style={styles.name}>{profile.firstName}</Txt>
        {/* Age range and the gender you chose, e.g. "25-30 · Female". */}
        <Txt style={{ fontSize: 17 }}>{[profile.ageRange, profile.gender].filter(Boolean).join(' · ')}</Txt>
        {!!from && (
          <View style={styles.where}>
            <Icon name="map-pin" color={colors.muted} />
            <Txt style={styles.from}>From {from}</Txt>
          </View>
        )}
      </View>

      <Card style={styles.card}>
        {!!profile.about.trim() && (
          <View style={styles.block}>
            <Txt style={styles.rowLabel}>About me</Txt>
            <Txt style={styles.value}>{profile.about.trim()}</Txt>
          </View>
        )}

        <View style={styles.block}>
          <Txt style={styles.rowLabel}>My kind of plans</Txt>
          {/* Option B (chosen by the owner): soft outline tags, justified rows. */}
          <BalancedTags items={profile.interests} />
        </View>

        <View style={styles.row}>
          <Txt style={styles.rowLabel}>Languages</Txt>
          <View style={{ alignItems: 'flex-end', gap: 4, flexShrink: 1 }}>
            {profile.languages.map((l) => (
              <Txt key={l.code} style={[styles.value, { textAlign: 'right' }]}>
                {l.name}
                {l.level && <Txt style={styles.level}> · {l.level}</Txt>}
              </Txt>
            ))}
          </View>
        </View>

        {profile.situation && (
          <View style={styles.row}>
            <Txt style={styles.rowLabel}>Your situation</Txt>
            <Txt style={styles.value}>{profile.situation}</Txt>
          </View>
        )}

        <Button title="Edit profile" variant="outline" onPress={onEdit} style={styles.edit} />
      </Card>
    </>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', marginTop: space.lg, gap: 8 },
  name: { fontFamily: fonts.serif, fontSize: 46, lineHeight: 54, color: colors.dark, marginTop: space.sm },
  from: { fontFamily: fonts.sans, fontSize: 15, lineHeight: 20, color: colors.accent },
  where: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: space.xs },
  card: { marginTop: space.xl, padding: 26, borderRadius: 30, gap: 0, ...shadow.soft, shadowOpacity: 0.05 },
  block: { gap: 12, marginBottom: space.lg },
  // Everything in the profile card is regular weight (no bold).
  value: { fontFamily: fonts.sans, fontSize: 15, lineHeight: 22, color: colors.dark },
  level: { fontFamily: fonts.sans, fontSize: 13, color: colors.accent },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    paddingVertical: 18,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  rowLabel: {
    fontFamily: fonts.sans,
    fontSize: 13,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: colors.muted,
  },
  edit: { marginTop: space.sm, minHeight: 52, borderRadius: 20 },
});
