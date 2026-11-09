import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Icon, type IconName } from '@/components';
import { Button, CornerFrame, IdCardArt, InfoBox, Screen, ScreenHeader, Txt } from '@/components';
import { useProfile } from '@/state/profile';
import { colors, fonts, radius, space } from '@/theme';

// Screen 13 — choose how to add the ID photo: camera (14) or upload (15).
export default function AddId() {
  const { idPhoto } = useProfile();
  const method = idPhoto?.source ?? 'camera';

  const options = [
    {
      key: 'camera',
      icon: 'aperture',
      title: 'Take a photo',
      sub: 'Use your camera now',
      go: () => router.push('/setup/take-id'),
    },
    {
      key: 'upload',
      icon: 'arrow-up',
      title: 'Upload a photo',
      sub: 'Choose from your device',
      go: () => router.push('/setup/upload-id'),
    },
  ] as const;

  return (
    <Screen
      scroll
      header={<ScreenHeader eyebrow="Age check" title="Add your ID" />}
      contentStyle={styles.content}
      footer={<Button title="Use this photo" arrow disabled={!idPhoto} onPress={() => router.back()} />}
    >
      <Txt>Use a clear photo of the side that shows your portrait and date of birth.</Txt>

      <LinearGradient colors={['#34302C', '#24201D']} style={styles.frame}>
        <View style={styles.frameInner}>
          <View style={StyleSheet.absoluteFill}>
            <CornerFrame
              width="100%"
              height={200}
              color={idPhoto ? '#7EE0A6' : colors.white}
              size={34}
              thickness={2.5}
            />
          </View>
          <View style={idPhoto ? undefined : styles.tilt}>
            <IdCardArt width={230} />
          </View>
        </View>
        <Txt style={styles.frameText}>{idPhoto ? '✓ ID photo ready' : 'Fit the whole document inside the frame'}</Txt>
      </LinearGradient>

      <View style={styles.options}>
        {options.map((o) => {
          const on = method === o.key;
          return (
            <Pressable
              key={o.key}
              accessibilityRole="button"
              onPress={o.go}
              style={({ pressed }) => [styles.option, on && styles.optionOn, pressed && { opacity: 0.75 }]}
            >
              <Icon name={o.icon} color={on ? colors.accent : colors.dark} />
              <View style={{ gap: 3 }}>
                <Txt variant="label">{o.title}</Txt>
                <Txt variant="caption">{o.sub}</Txt>
              </View>
            </Pressable>
          );
        })}
      </View>

      <InfoBox
        title="Before you continue"
        checks={[
          'All four corners are visible',
          'Text is sharp and readable',
          'No glare covers your photo or date of birth',
        ]}
      />

      <Txt variant="caption" center>
        Encrypted during verification and removed after the result is recorded.
      </Txt>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: space.xl, paddingBottom: space.xl, gap: space.lg },
  frame: {
    borderRadius: radius.lg + 12,
    paddingHorizontal: 22,
    paddingTop: 26,
    paddingBottom: 18,
    alignItems: 'center',
    gap: 16,
  },
  frameInner: { width: '100%', height: 200, alignItems: 'center', justifyContent: 'center' },
  tilt: { transform: [{ rotate: '-2deg' }] },
  frameText: { fontFamily: fonts.sansMedium, fontSize: 14, color: colors.white },
  options: { flexDirection: 'row', gap: 10 },
  option: {
    flex: 1,
    gap: 12,
    padding: 16,
    borderRadius: radius.md + 2,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  optionOn: { backgroundColor: colors.accentSoft, borderColor: colors.accentLine, borderWidth: 1.5 },
});
