import { StyleSheet, View } from 'react-native';
import { Icon, type IconName } from './Icon';
import { CITY, LANGUAGE_FLAGS } from '@/data/catalog';
import { MyProfile } from '@/data/types';
import { colors, fonts, shadow, space } from '@/theme';
import { Button } from './Button';
import { Card } from './Card';
import { Chip } from './Chip';
import { ProfilePhoto } from './ProfilePhoto';
import { Txt } from './Txt';

/** Your profile as other people see it: preview (20) and Profile tab (42). */
export function ProfileView({ profile, onEdit }: { profile: MyProfile; onEdit: () => void }) {
  const subtitle = [profile.ageRange, profile.from && `From ${profile.from}`].filter(Boolean).join(' · ');
  const where = profile.situation === 'Living locally' ? `Living in ${CITY}` : `Exploring ${CITY}`;
  return (
    <>
      <View style={styles.hero}>
        <ProfilePhoto name={profile.firstName} size={150} />
        <Txt style={styles.name}>{profile.firstName}</Txt>
        <Txt style={{ fontSize: 17 }}>{subtitle}</Txt>
        <View style={styles.where}>
          <Icon name="map-pin" color={colors.muted} />
          <Txt variant="label">{where}</Txt>
        </View>
      </View>

      <Card style={styles.card}>
        {!!profile.about.trim() && (
          <View style={styles.block}>
            <Txt variant="section">About me</Txt>
            <Txt style={{ fontSize: 15, lineHeight: 22 }}>{profile.about.trim()}</Txt>
          </View>
        )}

        <View style={styles.block}>
          <Txt variant="section">My kind of plans</Txt>
          <View style={styles.chips}>
            {profile.interests.map((i) => (
              <Chip key={i} label={i} selected />
            ))}
          </View>
        </View>

        <View style={styles.row}>
          <Txt style={styles.rowLabel}>Languages</Txt>
          <View style={{ alignItems: 'flex-end', gap: 4, flexShrink: 1 }}>
            {profile.languages.map((l) => (
              <Txt key={l.code} variant="label" style={{ textAlign: 'right' }}>
                {LANGUAGE_FLAGS[l.code] ? `${LANGUAGE_FLAGS[l.code]} ` : ''}
                {l.name} · {l.level}
              </Txt>
            ))}
          </View>
        </View>

        {profile.situation && (
          <View style={styles.row}>
            <Txt style={styles.rowLabel}>Your situation</Txt>
            <Txt variant="label">{profile.situation}</Txt>
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
  where: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: space.xs },
  card: { marginTop: space.xl, padding: 26, borderRadius: 30, gap: 0, ...shadow.soft, shadowOpacity: 0.05 },
  block: { gap: 12, marginBottom: space.lg },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
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
