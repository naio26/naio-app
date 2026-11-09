import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Avatar, Button, Screen, ScreenHeader, Txt } from '@/components';
import { usePeople } from '@/state/people';
import { useSafety } from '@/state/safety';
import { colors, space } from '@/theme';

// NEW screen (not in the designs): the people you've blocked.
export default function BlockedPeople() {
  const { blocked, unblock } = useSafety();
  const people = usePeople(blocked);
  return (
    <Screen
      scroll
      header={<ScreenHeader eyebrow="Trust & safety" title="Blocked people" />}
      contentStyle={{ paddingTop: space.lg, gap: space.lg }}
    >
      <Txt>Blocked people can’t see you or your plans, and you won’t see theirs. They aren’t told.</Txt>
      <View>
        {people.map((p) => (
          <View key={p.id} style={styles.row}>
            <Avatar initials={p.initials} size={48} color={p.avatarColor} serif />
            <Txt variant="bodyStrong" style={{ flex: 1 }}>
              {p.firstName}
            </Txt>
            <Button title="Unblock" variant="outline" onPress={() => unblock(p.id)} style={styles.small} />
          </View>
        ))}
      </View>
      {people.length === 0 && (
        <View style={{ gap: 14, paddingVertical: space.lg }}>
          <Txt variant="h2">You haven’t blocked anyone.</Txt>
          <Button title="Block someone" variant="outline" onPress={() => router.push('/safety/block')} />
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  small: { minHeight: 40, paddingHorizontal: 16, borderRadius: 14 },
});
