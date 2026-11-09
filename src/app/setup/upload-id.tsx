import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Icon, type IconName } from '@/components';
import { Button, Card, IdCardArt, InfoBox, Screen, ScreenHeader, Txt } from '@/components';
import { checkIdPhoto } from '@/data/api';
import { useProfile } from '@/state/profile';
import { colors, icon, radius, space } from '@/theme';

// Screen 15 — fake upload: tapping the box "picks" a sample ID photo.
export default function UploadId() {
  const { setIdPhoto } = useProfile();
  const [state, setState] = useState<'empty' | 'checking' | 'ready'>('empty');

  const pick = async () => {
    setState('checking');
    await checkIdPhoto();
    setState('ready');
  };

  const use = () => {
    setIdPhoto({ source: 'upload' });
    router.dismissTo('/setup/verify-age');
  };

  return (
    <Screen
      scroll
      header={<ScreenHeader eyebrow="Age check" title="Upload ID photo" />}
      contentStyle={styles.content}
      footer={<Button title="Use this photo" arrow disabled={state !== 'ready'} onPress={use} />}
    >
      <Txt>Choose a clear image showing your portrait and date of birth.</Txt>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Choose from your device"
        onPress={pick}
        disabled={state === 'checking'}
        style={({ pressed }) => [styles.drop, pressed && { opacity: 0.8 }]}
      >
        {state === 'checking' ? (
          <ActivityIndicator color={colors.accent} />
        ) : (
          <Icon name="arrow-up" size={icon.tab} color={colors.accent} />
        )}
        <Txt variant="bodyStrong" style={{ fontSize: 17 }}>
          {state === 'ready' ? 'Choose another photo' : 'Choose from your device'}
        </Txt>
        <Txt variant="caption">JPG, PNG or HEIC</Txt>
      </Pressable>

      {state === 'ready' && (
        <Card style={styles.ready}>
          <View style={styles.thumb}>
            <IdCardArt width={104} tone="mini" />
          </View>
          <View style={{ flex: 1, gap: 4 }}>
            <Txt variant="label">ID photo ready</Txt>
            <Txt variant="caption">All four corners detected</Txt>
          </View>
          <Icon name="check" color={colors.green} />
        </Card>
      )}

      <InfoBox
        title="Before you continue"
        checks={['Text is sharp and readable', 'No glare covers your photo or date of birth']}
      />

      <Txt variant="caption" center>
        Encrypted during verification and removed after the result is recorded.
      </Txt>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: space.xl, paddingBottom: space.xl, gap: space.lg },
  drop: {
    height: 210,
    borderRadius: radius.lg + 6,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.accentLine,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  ready: { flexDirection: 'row', alignItems: 'center', gap: 16, padding: 14, paddingRight: 20 },
  thumb: {
    width: 110,
    height: 72,
    borderRadius: 12,
    backgroundColor: colors.mist,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
