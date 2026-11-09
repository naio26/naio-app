import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Icon, type IconName } from '@/components';
import { Button, Logo, ProfileView, Screen } from '@/components';
import { saveProfile } from '@/data/api';
import { useProfile } from '@/state/profile';
import { colors, space } from '@/theme';

// Screen 20 — your profile as other people will see it, before creating it.
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
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Edit profile"
          onPress={() => router.back()}
          style={styles.iconBtn}
        >
          <Icon name="pencil" color={colors.dark} />
        </Pressable>
      </View>
      <ProfileView profile={profile} onEdit={() => router.back()} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: space.xl },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: space.xl },
  iconBtn: { padding: 6 },
});
