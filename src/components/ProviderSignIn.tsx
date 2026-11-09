import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Icon, type IconName } from './Icon';
import { colors, fonts, space } from '@/theme';
import { Avatar } from './Avatar';
import { BackButton } from './BackButton';
import { Button } from './Button';
import { Card } from './Card';
import { Screen } from './Screen';
import { Txt } from './Txt';

type Props = {
  provider: 'Apple' | 'Google';
  logo: ReactNode;
  name: string;
  email: string;
  initials: string;
  /** Extra options between the account and the info box (Apple's "Hide my email"). */
  children?: ReactNode;
  loading: boolean;
  onContinue: () => void;
};

/** Fake system sign-in sheet shared by screens 07 (Apple) and 08 (Google). */
export function ProviderSignIn({ provider, logo, name, email, initials, children, loading, onContinue }: Props) {
  return (
    <Screen scroll>
      <View style={styles.back}>
        <BackButton />
      </View>

      <View style={styles.head}>
        {logo}
        <Txt variant="h1" center style={styles.title}>
          Sign in with {provider}
        </Txt>
        <Txt variant="body" center>
          Continue to <Txt style={{ fontFamily: fonts.sansBold, color: colors.muted }}>naio.</Txt>
        </Txt>
      </View>

      <Card style={styles.account}>
        <Avatar initials={initials} size={52} />
        <View style={{ flex: 1, gap: 2 }}>
          <Txt variant="bodyStrong">{name}</Txt>
          <Txt variant="small" numberOfLines={1}>
            {email}
          </Txt>
        </View>
        <Icon name="check" color={colors.green} />
      </Card>

      {children}

      <Card tone="muted" style={styles.info}>
        <Txt variant="small">naio will receive</Txt>
        <Txt variant="bodyStrong">Your name and email address</Txt>
        <Txt variant="small">You can change profile visibility inside naio.</Txt>
      </Card>

      <Button title="Continue" arrow loading={loading} onPress={onContinue} style={styles.continue} />
      <Button title="Cancel" variant="link" onPress={() => router.back()} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  back: { marginTop: space.lg },
  head: { alignItems: 'center', marginTop: space.lg, gap: 10 },
  title: { marginTop: space.lg },
  account: { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: space.xxl, paddingVertical: 14 },
  info: { gap: 6, marginTop: space.lg, padding: 18 },
  continue: { marginTop: space.xl },
});
