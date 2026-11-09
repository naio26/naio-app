import { Pressable, StyleSheet, View } from 'react-native';
import { Icon, type IconName } from './Icon';
import { colors } from '@/theme';
import { Txt } from './Txt';

/** A row in Settings (43): title, optional subtitle, chevron. */
export function SettingsRow({
  title,
  sub,
  onPress,
  danger,
  right,
}: {
  title: string;
  sub?: string;
  onPress: () => void;
  danger?: boolean;
  right?: React.ReactNode;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && { opacity: 0.6 }]}
    >
      <View style={{ flex: 1, gap: 4 }}>
        <Txt variant="bodyStrong" color={danger ? colors.danger : colors.dark} style={{ fontSize: 17 }}>
          {title}
        </Txt>
        {sub && <Txt variant="small">{sub}</Txt>}
      </View>
      {right ?? (!danger && <Icon name="chevron-right" color={colors.muted} />)}
    </Pressable>
  );
}

export function SettingsSection({ title }: { title: string }) {
  return <Txt style={styles.section}>{title}</Txt>;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  section: {
    fontSize: 13,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: colors.muted,
    marginTop: 28,
    marginBottom: 4,
  },
});
