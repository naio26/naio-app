import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Avatar, Button, Screen, ScreenHeader, Txt } from '@/components';
import { listEveryone } from '@/data/api';
import { useLoad } from '@/data/hooks';
import { useSafety } from '@/state/safety';
import { colors, fonts, space } from '@/theme';

// Block someone (from the Safety centre).
export default function BlockSomeone() {
  const everyone = useLoad(listEveryone, []) ?? [];
  const { blocked, block, unblock } = useSafety();
  const [asking, setAsking] = useState<string | null>(null);

  return (
    <Screen
      scroll
      header={<ScreenHeader eyebrow="Safety" title="Block someone" />}
      contentStyle={{ paddingTop: space.lg, gap: space.lg }}
    >
      <Txt>They won’t see you or your plans, and you won’t see theirs. They aren’t told.</Txt>
      <View>
        {everyone.map((p) => {
          const isBlocked = blocked.includes(p.id);
          return (
            <View key={p.id} style={styles.row}>
              <Avatar initials={p.initials} size={48} color={p.avatarColor} serif />
              <View style={{ flex: 1, gap: 2 }}>
                <Txt variant="bodyStrong">{asking === p.id ? `Block ${p.firstName}?` : p.firstName}</Txt>
                <Txt variant="caption">{isBlocked ? 'Blocked' : `${p.ageRange} · ${p.situation ?? ''}`}</Txt>
              </View>
              {isBlocked ? (
                <Button title="Unblock" variant="outline" onPress={() => unblock(p.id)} style={styles.small} />
              ) : asking === p.id ? (
                <View style={styles.confirm}>
                  <Pressable hitSlop={8} onPress={() => setAsking(null)}>
                    <Txt style={styles.keep}>Cancel</Txt>
                  </Pressable>
                  <Button
                    title="Block"
                    variant="danger"
                    onPress={async () => {
                      await block(p.id);
                      setAsking(null);
                    }}
                    style={styles.small}
                  />
                </View>
              ) : (
                <Pressable hitSlop={8} onPress={() => setAsking(p.id)}>
                  <Txt style={styles.blockText}>Block</Txt>
                </Pressable>
              )}
            </View>
          );
        })}
      </View>
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
  confirm: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  keep: { fontFamily: fonts.sansMedium, fontSize: 14, color: colors.muted },
  blockText: { fontFamily: fonts.sansBold, fontSize: 14, color: colors.danger },
});
