import { StyleSheet, View } from 'react-native';
import { Icon, type IconName } from './Icon';
import { MyProfile } from '@/data/types';
import { colors, fonts, shadow, space } from '@/theme';
import { Button } from './Button';
import { Card } from './Card';
import { Chip } from './Chip';
import { ProfilePhoto } from './ProfilePhoto';
import { Txt } from './Txt';

/**
 * How "My kind of plans" looks. 'chips' = the current version.
 * 'A' and 'B' are calmer test versions, only shown from Settings → Demo until the owner chooses.
 */
export type PlansLook = 'chips' | 'A' | 'B';

/** Your profile as other people see it: preview (20) and Profile tab (42). */
export function ProfileView({
  profile,
  onEdit,
  plansLook = 'chips',
}: {
  profile: MyProfile;
  onEdit: () => void;
  plansLook?: PlansLook;
}) {
  // Where you're FROM (optional, asked in "Add more about you"). We don't show where you are now.
  const from = profile.from.trim();
  return (
    <>
      <View style={styles.hero}>
        <ProfilePhoto name={profile.firstName} size={150} />
        <Txt style={styles.name}>{profile.firstName}</Txt>
        <Txt style={{ fontSize: 17 }}>{profile.ageRange}</Txt>
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
            <Txt variant="section">About me</Txt>
            <Txt style={{ fontSize: 15, lineHeight: 22 }}>{profile.about.trim()}</Txt>
          </View>
        )}

        <View style={styles.block}>
          <Txt style={styles.rowLabel}>My kind of plans</Txt>
          {plansLook === 'A' ? (
            // A · quiet line: just the words, separated by "·". No boxes, no colour.
            // Each word keeps its "·" so a line never starts with one.
            <View style={styles.quietRow}>
              {profile.interests.map((i, n) => (
                <Txt key={i} style={styles.quietLine}>
                  {i}
                  {n < profile.interests.length - 1 ? '  ·' : ''}
                </Txt>
              ))}
            </View>
          ) : plansLook === 'B' ? (
            // B · soft tags: thin sand outline, no fill, regular dark text, left-aligned.
            <View style={styles.softTags}>
              {profile.interests.map((i) => (
                <View key={i} style={styles.softTag}>
                  <Txt style={styles.softTagText}>{i}</Txt>
                </View>
              ))}
            </View>
          ) : (
            // Current version: two columns, each chip centred in its column.
            <View style={styles.chips}>
              {profile.interests.map((i) => (
                <View key={i} style={styles.chipCell}>
                  <Chip label={i} selected />
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.row}>
          <Txt style={styles.rowLabel}>Languages</Txt>
          <View style={{ alignItems: 'flex-end', gap: 4, flexShrink: 1 }}>
            {profile.languages.map((l) => (
              <Txt key={l.code} variant="label" style={{ textAlign: 'right' }}>
                {l.name}
                {l.level && <Txt style={styles.level}> · {l.level}</Txt>}
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
  from: { fontFamily: fonts.sans, fontSize: 15, lineHeight: 20, color: colors.accent },
  where: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: space.xs },
  card: { marginTop: space.xl, padding: 26, borderRadius: 30, gap: 0, ...shadow.soft, shadowOpacity: 0.05 },
  block: { gap: 12, marginBottom: space.lg },
  chips: { flexDirection: 'row', flexWrap: 'wrap', rowGap: 10 },
  chipCell: { width: '50%', alignItems: 'center', paddingHorizontal: 4 },
  quietRow: { flexDirection: 'row', flexWrap: 'wrap', columnGap: 10 },
  quietLine: { fontFamily: fonts.sans, fontSize: 16, lineHeight: 26, color: colors.dark },
  softTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  softTag: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
  },
  softTagText: { fontFamily: fonts.sans, fontSize: 14, lineHeight: 19, color: colors.dark },
  level: { fontFamily: fonts.sans, color: colors.accent },
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
