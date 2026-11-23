import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Button, Logo, ProfileView, Screen } from '@/components';
import { saveProfile } from '@/data/api';
import { useProfile } from '@/state/profile';
import { space } from '@/theme';
import { goBack } from '@/components';

// Screen 20 — your profile as other people will see it, before creating it.
// "Create profile" saves it and opens 21, which first explains why naio needs your location.
export default function ProfileCompleted() {
  const { profile, setCreated } = useProfile();
  const [saving, setSaving] = useState(false);

  const create = async () => {
    setSaving(true);
    await saveProfile(profile);
    setCreated(true);
    setSaving(false);
    router.replace('/setup/welcome');
  };

  return (
    <Screen
      scroll
      contentStyle={styles.content}
      footer={<Button title="Create profile" arrow loading={saving} onPress={create} />}
    >
      <View style={styles.top}>
        <Logo size={44} />
      </View>
      <ProfileView profile={profile} onEdit={() => goBack()} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: space.xl },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: space.xl },
});
