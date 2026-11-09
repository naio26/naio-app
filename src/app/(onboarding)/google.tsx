import { useState } from 'react';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ProviderSignIn } from '@/components';
import { mockGoogleAccount, signInWithGoogle } from '@/data/api';
import { useSession } from '@/state/session';

// Screen 08 — fake "Sign in with Google" sheet.
export default function GoogleSignIn() {
  const { setAccount } = useSession();
  const [loading, setLoading] = useState(false);

  const onContinue = async () => {
    setLoading(true);
    setAccount(await signInWithGoogle());
    setLoading(false);
    router.push('/setup/profile');
  };

  return (
    <ProviderSignIn
      provider="Google"
      logo={<Ionicons name="logo-google" size={56} color="#4285F4" />}
      name={mockGoogleAccount.name}
      email={mockGoogleAccount.email}
      initials="AM"
      loading={loading}
      onContinue={onContinue}
    />
  );
}
