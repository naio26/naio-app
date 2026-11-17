import { useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { Button, Card, Screen, ScreenHeader, SettingsRow, SettingsSection, Txt } from '@/components';
import { useBoot } from '@/state/boot';
import { useSafety } from '@/state/safety';
import { colors, space } from '@/theme';

// Screen 43 — Settings.
export default function Settings() {
  const { offline, setOffline, locationMode, prefs, blocked } = useSafety();
  const on = Object.values(prefs).filter(Boolean).length;
  const { resetDemo } = useBoot();
  const [confirmReset, setConfirmReset] = useState(false);
  const [resetting, setResetting] = useState(false);
  return (
    <Screen
      scroll
      header={<ScreenHeader eyebrow="You’re in control" title="Settings" />}
      contentStyle={{ paddingBottom: space.xl }}
    >
      <SettingsSection title="Privacy" />
      <SettingsRow
        title="Location visibility"
        sub={locationMode === 'approximate' ? 'Approximate area while active' : 'Only when you join or host a plan'}
        onPress={() => router.push('/settings/location')}
      />
      <SettingsRow
        title="Notification preferences"
        sub={on === 3 ? 'Joins, matches and messages' : on === 0 ? 'All off' : `${on} of 3 on`}
        onPress={() => router.push('/settings/notifications')}
      />

      <SettingsSection title="Trust & safety" />
      <SettingsRow
        title="Safety centre"
        sub="Block, report and meetup guidance"
        onPress={() => router.push('/safety')}
      />
      <SettingsRow
        title="Blocked people"
        sub={blocked.length ? `${blocked.length} blocked` : undefined}
        onPress={() => router.push('/settings/blocked')}
      />

      <SettingsSection title="Account" />
      <SettingsRow title="Terms & privacy" onPress={() => router.push('/settings/terms')} />
      <SettingsRow
        title={offline ? 'Go back online' : 'Go offline & hide from map'}
        sub={offline ? 'You’re hidden. People can’t see you on the map.' : undefined}
        danger={!offline}
        onPress={() => setOffline(!offline)}
        right={
          offline ? (
            <Txt variant="label" color={colors.green}>
              Offline
            </Txt>
          ) : undefined
        }
      />

      {/* Demo only: clears everything saved on this phone and starts again from the intro. */}
      <SettingsSection title="Demo" />
      {confirmReset ? (
        <Card tone="muted" style={{ marginTop: space.md, padding: 20, gap: 14 }}>
          <Txt variant="bodyStrong">Reset the demo?</Txt>
          <Txt variant="small">
            This clears your profile, filters, plans, chats and settings on this phone, and starts again from the intro.
          </Txt>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Button
              title="Keep"
              variant="outline"
              onPress={() => setConfirmReset(false)}
              style={{ flex: 1, minHeight: 48 }}
            />
            <Button
              title="Reset"
              variant="danger"
              loading={resetting}
              onPress={async () => {
                setResetting(true);
                await resetDemo();
              }}
              style={{ flex: 1, minHeight: 48 }}
            />
          </View>
        </Card>
      ) : (
        <SettingsRow
          title="Reset demo"
          sub="Clear everything and start again from the intro"
          onPress={() => setConfirmReset(true)}
        />
      )}
    </Screen>
  );
}
