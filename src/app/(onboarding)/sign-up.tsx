import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button, Input, Logo, Screen, Txt } from '@/components';
import { signInWithEmail } from '@/data/api';
import { useSession } from '@/state/session';
import { colors, space, type } from '@/theme';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Screen 06
export default function SignUp() {
  const { setAccount } = useSession();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  const continueWithEmail = async () => {
    if (!EMAIL.test(email.trim())) {
      setError('Add a valid email to continue.');
      return;
    }
    setError(undefined);
    setLoading(true);
    setAccount(await signInWithEmail(email));
    setLoading(false);
    router.push('/setup/profile');
  };

  return (
    <Screen scroll contentStyle={styles.content}>
      <View style={styles.logo}>
        <Logo size={44} />
      </View>

      <View style={styles.hero}>
        <Txt variant="eyebrow">Cool plans, nearby</Txt>
        <Txt variant="display" style={styles.title}>
          Let’s get you{'\n'}out there.
        </Txt>
      </View>

      <View style={styles.social}>
        <Button
          variant="social"
          title="Continue with Apple"
          icon={<Ionicons name="logo-apple" size={22} color={colors.dark} />}
          onPress={() => router.push('/apple')}
        />
        <Button
          variant="social"
          title="Continue with Google"
          icon={<Ionicons name="logo-google" size={19} color="#4285F4" />}
          onPress={() => router.push('/google')}
        />
      </View>

      <View style={styles.or}>
        <View style={styles.line} />
        <Txt variant="small">or</Txt>
        <View style={styles.line} />
      </View>

      <Input
        label="Email"
        placeholder="you@email.com"
        value={email}
        onChangeText={(t) => {
          setEmail(t);
          if (error) setError(undefined);
        }}
        error={error}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        autoCorrect={false}
        returnKeyType="go"
        onSubmitEditing={continueWithEmail}
      />

      <Button title="Continue" arrow loading={loading} onPress={continueWithEmail} style={styles.continue} />

      <Txt variant="caption" center style={styles.terms}>
        By continuing, you agree to naio’s Terms and Safety Guidelines.
      </Txt>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: space.xxl },
  logo: { alignItems: 'flex-end', marginTop: space.xxl },
  hero: { marginTop: 96, gap: 14, marginBottom: space.xxl },
  title: { fontSize: 44, lineHeight: 48 },
  social: { gap: 10 },
  or: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: space.lg },
  line: { flex: 1, height: 1, backgroundColor: colors.border },
  continue: { marginTop: space.md, minHeight: 54 },
  terms: { ...type.caption, marginTop: space.lg },
});
