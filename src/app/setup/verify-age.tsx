import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Icon, type IconName } from '@/components';
import { Button, Card, Screen, ScreenHeader, Txt } from '@/components';
import { verifyAgeRange } from '@/data/api';
import { DOC_TYPES } from '@/data/types';
import { useProfile } from '@/state/profile';
import { colors, fonts, radius, space } from '@/theme';

// Screen 12 — confirm the chosen range with an official document (fake check).
export default function VerifyAge() {
  const { profile, update, docType, setDocType, idPhoto, setIdPhoto } = useProfile();
  const [checking, setChecking] = useState(false);

  const verify = async () => {
    if (!profile.ageRange) return;
    setChecking(true);
    await verifyAgeRange(profile.ageRange, docType);
    setChecking(false);
    update({ ageVerified: true });
    router.dismissTo('/setup/profile');
  };

  const button = profile.ageVerified
    ? { title: 'Age verified · Back to profile', onPress: () => router.dismissTo('/setup/profile') }
    : idPhoto
      ? { title: checking ? 'Checking your ID…' : 'Verify my age', onPress: verify }
      : { title: 'Add document to continue', onPress: undefined };

  return (
    <Screen
      scroll
      header={<ScreenHeader eyebrow="Age check" title="Verify your range" />}
      contentStyle={styles.content}
      footer={
        <Button title={button.title} arrow disabled={!button.onPress} loading={checking} onPress={button.onPress} />
      }
    >
      <Card tone="soft" style={styles.range}>
        <Txt variant="small" style={{ fontSize: 15 }}>
          Selected range
        </Txt>
        <Txt style={styles.rangeValue}>{profile.ageRange ?? '—'}</Txt>
      </Card>

      <Txt>Use an official document to confirm that your date of birth matches this range.</Txt>

      <View style={{ gap: 12 }}>
        <Txt variant="label">Document type</Txt>
        <View style={styles.docs}>
          {DOC_TYPES.map((d) => {
            const on = d === docType;
            return (
              <Pressable
                key={d}
                accessibilityRole="button"
                accessibilityState={{ selected: on }}
                onPress={() => {
                  if (d !== docType) setIdPhoto(null); // a new document type needs a new photo
                  setDocType(d);
                  update({ ageVerified: false });
                }}
                style={[styles.doc, on && styles.docOn]}
              >
                <Txt style={[styles.docText, on && styles.docTextOn]}>{d}</Txt>
              </Pressable>
            );
          })}
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={() => router.push('/setup/add-id')}
        style={({ pressed }) => [styles.add, idPhoto && styles.addDone, pressed && { opacity: 0.75 }]}
      >
        <Icon name={idPhoto ? 'check' : 'id-card'} color={idPhoto ? colors.green : colors.dark} />
        <View style={{ flex: 1, gap: 4 }}>
          <Txt variant="bodyStrong" style={{ fontSize: 17 }}>
            {idPhoto ? 'ID photo ready' : 'Add the photo page'}
          </Txt>
          <Txt variant="caption">
            {idPhoto
              ? `${idPhoto.source === 'camera' ? 'Taken with your camera' : 'Uploaded from your device'} · Tap to change`
              : 'Make sure your name and date of birth are readable.'}
          </Txt>
        </View>
        <Icon name={idPhoto ? 'refresh-cw' : 'camera'} color={colors.muted} />
      </Pressable>

      <Card style={styles.info}>
        <Icon name="check" color={colors.dark} />
        <View style={{ flex: 1, gap: 6 }}>
          <Txt style={styles.infoTitle}>What naio checks</Txt>
          <Txt variant="small" style={{ fontSize: 14, lineHeight: 20 }}>
            We read your date of birth, confirm the age range and compare the ID portrait with your profile photo. Other
            people only see “Age verified”.
          </Txt>
        </View>
      </Card>

      <Card style={[styles.info, { alignItems: 'center' }]}>
        <Icon name="lock" color={colors.muted} />
        <Txt variant="small" style={{ flex: 1, fontSize: 14, lineHeight: 20 }}>
          Your document is encrypted and removed after the verification result is recorded.
        </Txt>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: space.xl, paddingBottom: space.xl, gap: space.lg },
  range: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    paddingVertical: 24,
  },
  rangeValue: { fontFamily: fonts.serifBold, fontSize: 40, lineHeight: 46, color: colors.dark },
  docs: { flexDirection: 'row', gap: 10 },
  doc: {
    flex: 1,
    height: 56,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  docOn: { backgroundColor: colors.accentSoft, borderColor: colors.accentLine, borderWidth: 1.5 },
  docText: { fontFamily: fonts.sans, fontSize: 14, color: colors.dark, textAlign: 'center' },
  docTextOn: { fontFamily: fonts.sansBold, color: colors.accent },
  add: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 18,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.accentLine,
  },
  addDone: { borderStyle: 'solid', borderColor: colors.green, backgroundColor: colors.white },
  info: { flexDirection: 'row', gap: 16, padding: 22 },
  infoTitle: { fontFamily: fonts.sansBold, fontSize: 16, color: colors.accent },
});
