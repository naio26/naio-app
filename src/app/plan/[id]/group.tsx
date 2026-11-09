import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Avatar, BackButton, Screen, Txt } from '@/components';
import { usePeople } from '@/state/people';
import { usePlan, usePlans } from '@/state/plans';
import { colors, fonts, space } from '@/theme';

// Screen 36 — the host manages who is in their plan.
export default function ManageGroup() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const plan = usePlan(id);
  const { statusOf, membersOf, removeMember } = usePlans();
  const people = usePeople(plan ? membersOf(plan).filter((m) => m !== 'me') : []);
  const [confirming, setConfirming] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  if (!plan) return <Screen>{null}</Screen>;
  const isHost = statusOf(plan) === 'host';

  const remove = async (personId: string, name: string) => {
    setBusy(personId);
    await removeMember(plan.id, personId);
    setBusy(null);
    setConfirming(null);
    setNotice(`${name} was removed. They’ve been told privately.`);
  };

  return (
    <Screen scroll contentStyle={styles.content}>
      <View>
        <BackButton />
      </View>
      <View style={{ gap: 10 }}>
        <Txt variant="h1">Manage group</Txt>
        <Txt>Only the host can remove someone from the plan.</Txt>
      </View>

      {!isHost && <Txt>Only {plan.title}’s host can see this page.</Txt>}

      {isHost && (
        <View>
          {people.map((p) => {
            const asking = confirming === p.id;
            return (
              <View key={p.id} style={styles.row}>
                <Avatar initials={p.initials} size={52} />
                <View style={{ flex: 1, gap: 4 }}>
                  <Txt variant="bodyStrong">{asking ? `Remove ${p.firstName}?` : p.firstName}</Txt>
                  <Txt variant="caption">
                    {p.languages
                      .slice(0, 2)
                      .map((l) => l.name)
                      .join(' · ')}
                  </Txt>
                </View>
                {asking ? (
                  <View style={styles.confirm}>
                    <Pressable hitSlop={8} onPress={() => setConfirming(null)}>
                      <Txt style={styles.cancel}>Keep</Txt>
                    </Pressable>
                    <Pressable
                      hitSlop={8}
                      onPress={() => remove(p.id, p.firstName)}
                      style={styles.removeBtn}
                      disabled={busy === p.id}
                    >
                      <Txt style={styles.removeBtnText}>{busy === p.id ? 'Removing…' : 'Remove'}</Txt>
                    </Pressable>
                  </View>
                ) : (
                  <Pressable accessibilityRole="button" hitSlop={8} onPress={() => setConfirming(p.id)}>
                    <Txt style={styles.remove}>Remove</Txt>
                  </Pressable>
                )}
              </View>
            );
          })}
          {people.length === 0 && <Txt>No one else has joined yet.</Txt>}
        </View>
      )}

      {notice && (
        <View style={styles.notice}>
          <Txt variant="small" color={colors.green}>
            {notice}
          </Txt>
        </View>
      )}

      <Txt variant="small">
        Removing someone ends their access to the chat and exact meeting point. They are notified privately.
      </Txt>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: space.lg, paddingBottom: space.xl, gap: space.xl },
  row: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingVertical: 16 },
  remove: { fontFamily: fonts.sansBold, fontSize: 14, color: colors.danger },
  confirm: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  cancel: { fontFamily: fonts.sansMedium, fontSize: 14, color: colors.muted },
  removeBtn: {
    backgroundColor: colors.danger,
    borderRadius: 999,
    paddingHorizontal: 14,
    height: 34,
    justifyContent: 'center',
  },
  removeBtnText: { fontFamily: fonts.sansBold, fontSize: 13, color: colors.white },
  notice: { backgroundColor: colors.greenSoft, borderRadius: 14, padding: 14 },
});
