import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ProviderSignIn, Txt } from '@/components';
import { mockAppleAccount, signInWithApple } from '@/data/api';
import { useSession } from '@/state/session';
import { colors, space } from '@/theme';

// Screen 07 — fake "Sign in with Apple" sheet.
export default function AppleSignIn() {
  const { setAccount } = useSession();
  const [hideEmail, setHideEmail] = useState(true);
  const [loading, setLoading] = useState(false);

  const onContinue = async () => {
    setLoading(true);
    setAccount(await signInWithApple(hideEmail));
    setLoading(false);
    router.push('/setup/profile');
  };

  return (
    <ProviderSignIn
      provider="Apple"
      logo={<Ionicons name="logo-apple" size={64} color={colors.dark} />}
      name={mockAppleAccount.name}
      email={hideEmail ? mockAppleAccount.privateEmail : mockAppleAccount.email}
      initials="A"
      loading={loading}
      onContinue={onContinue}
    >
      <Pressable
        accessibilityRole="switch"
        accessibilityState={{ checked: hideEmail }}
        onPress={() => setHideEmail((v) => !v)}
        style={styles.option}
      >
        <View style={[styles.radio, hideEmail && styles.radioOn]}>{hideEmail && <View style={styles.dot} />}</View>
        <View style={{ flex: 1, gap: 2 }}>
          <Txt variant="bodyStrong" style={styles.hideTitle}>
            Hide my email
          </Txt>
          <Txt variant="caption">Apple creates a private relay address for naio.</Txt>
        </View>
      </Pressable>
    </ProviderSignIn>
  );
}

const styles = StyleSheet.create({
  // No box: kept apart from the account card (and the text below) by extra space only.
  option: { flexDirection: 'row', gap: 12, marginTop: space.xxl, paddingHorizontal: 6 },
  hideTitle: { fontSize: 14, lineHeight: 19 },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.faint,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 0,
  },
  radioOn: { borderColor: '#0A7AFF' },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#0A7AFF' },
});
