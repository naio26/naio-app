import { useEffect, useState } from 'react';
import { LayoutAnimation, Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Icon, type IconName } from '@/components';
import { Button, Input, ProfilePhoto, Screen, ScreenHeader, SelectField, Txt } from '@/components';
import { CITY } from '@/data/catalog';
import { useProfile } from '@/state/profile';
import { useSession } from '@/state/session';
import { colors, fonts, space } from '@/theme';

// Screen 09 — the profile checklist. Every field opens its own step and comes back here.
export default function ProfileSetup() {
  const { account } = useSession();
  const { profile, update, missing, created } = useProfile();
  const [more, setMore] = useState(!!(profile.about || profile.from || profile.situation));

  // Start with the first name from Apple/Google, if we have it.
  useEffect(() => {
    const fromAccount = account?.name.split(' ')[0];
    if (fromAccount && !profile.firstName) update({ firstName: fromAccount });
    // Only when the account changes, not on every keystroke.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  const toggleMore = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setMore((m) => !m);
  };

  const ready = missing.length === 0;
  const languages = profile.languages.map((l) => `${l.name} · ${l.level ?? '—'}`).join(', ');

  return (
    <Screen
      scroll
      header={<ScreenHeader eyebrow={created ? 'Edit' : 'Takes one minute'} title="Your profile" />}
      contentStyle={styles.content}
      footer={
        <Button
          title={!ready ? 'Complete required fields' : created ? 'Save changes' : 'Review profile'}
          arrow
          disabled={!ready}
          onPress={() => (created ? router.back() : router.push('/setup/completed'))}
        />
      }
    >
      {/* Photo (required, selfie check) */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={profile.photoChecked ? 'Photo checked. Tap to retake.' : 'Add your photo'}
        onPress={() => router.push('/setup/face-check')}
        style={styles.photoWrap}
      >
        {profile.photoChecked ? (
          <>
            <ProfilePhoto name={profile.firstName || account?.name || ''} size={128} />
            <Txt variant="caption" color={colors.green} style={styles.photoNote}>
              Live photo checked · Tap to retake
            </Txt>
          </>
        ) : (
          <View style={styles.photoEmpty}>
            <Icon name="camera" color={colors.accent} />
            <Txt style={styles.photoTitle}>Add your photo *</Txt>
            <Txt style={styles.photoSub}>Required · selfie check</Txt>
          </View>
        )}
      </Pressable>

      <View style={styles.field}>
        <Txt variant="section">First name</Txt>
        <Input
          placeholder="Your first name"
          value={profile.firstName}
          onChangeText={(t) => update({ firstName: t })}
          autoCapitalize="words"
          autoComplete="given-name"
          maxLength={30}
          returnKeyType="done"
        />
      </View>

      <SelectField
        label="Age range"
        placeholder="Select verified range"
        value={profile.ageRange}
        note={
          profile.ageRange && (
            <Txt variant="caption" color={profile.ageVerified ? colors.green : colors.accent}>
              {profile.ageVerified ? '✓ Verified by ID' : 'Not verified yet · tap to verify'}
            </Txt>
          )
        }
        onPress={() => router.push('/setup/age-range')}
      />

      <SelectField
        label="Languages you speak"
        placeholder="Add languages and speaking level"
        value={languages || undefined}
        icon={languages ? 'pencil' : 'plus'}
        highlight
        onPress={() => router.push('/setup/languages')}
      />

      <SelectField
        label="Choose your interests"
        placeholder="Select at least 3 interests"
        value={profile.interests.length ? profile.interests.join(', ') : undefined}
        icon={profile.interests.length ? 'pencil' : 'plus'}
        highlight
        onPress={() => router.push('/setup/interests')}
      />

      {/* "Add more about you" — optional details. Not in the designs: drawn in the same style. */}
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: more }}
        onPress={toggleMore}
        style={styles.moreRow}
      >
        <View style={{ flex: 1, gap: 4 }}>
          <Txt style={styles.moreTitle}>+ Add more about you</Txt>
          <Txt variant="caption">Optional profile details</Txt>
        </View>
        <Icon name={more ? 'chevron-up' : 'chevron-down'} color={colors.accent} />
      </Pressable>

      {more && (
        <View style={styles.more}>
          <View style={styles.field}>
            <Txt variant="section">About me</Txt>
            <Input
              placeholder="A line or two: what you do, what you love."
              value={profile.about}
              onChangeText={(t) => update({ about: t })}
              multiline
              maxLength={160}
              style={styles.about}
            />
            <Txt variant="caption" style={{ alignSelf: 'flex-end' }}>
              {profile.about.length}/160
            </Txt>
          </View>
          <View style={styles.field}>
            <Txt variant="section">Where you’re from</Txt>
            <Input
              placeholder="City, country"
              value={profile.from}
              onChangeText={(t) => update({ from: t })}
              autoCapitalize="words"
              maxLength={40}
            />
          </View>
          <SelectField
            label="Your situation"
            placeholder={`How are you experiencing ${CITY}?`}
            value={profile.situation}
            icon="chevron-right"
            onPress={() => router.push('/setup/situation')}
          />
        </View>
      )}

      <Txt variant="caption" style={styles.privacy}>
        Your exact location is never shown. naio uses an approximate area while you’re active.
      </Txt>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: space.xl, paddingBottom: space.xl, gap: space.xl },
  photoWrap: { alignSelf: 'center', alignItems: 'center' },
  photoEmpty: {
    width: 128,
    height: 128,
    borderRadius: 64,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.accentLine,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  photoTitle: { fontFamily: fonts.sansMedium, fontSize: 13, color: colors.accent, marginTop: 4 },
  photoSub: { fontFamily: fonts.sans, fontSize: 10, color: colors.muted },
  photoNote: { marginTop: 8 },
  field: { gap: 10 },
  moreRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  moreTitle: {
    fontFamily: fonts.sansBold,
    fontSize: 15,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: colors.accent,
  },
  more: { gap: space.xl },
  about: { height: 96, paddingTop: 14, textAlignVertical: 'top' },
  privacy: { fontSize: 13, lineHeight: 19 },
});
