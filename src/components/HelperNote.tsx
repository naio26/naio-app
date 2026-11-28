import { StyleSheet, View } from 'react-native';
import { colors, space } from '@/theme';
import { Icon, type IconName } from './Icon';
import { Txt } from './Txt';

/**
 * A small, discreet note with no box: a thin icon, a short title on one line and the text below.
 * "Plans don’t live forever." (My plans) and "No noise." (Alerts) use it.
 */
export function HelperNote({ icon, title, text }: { icon: IconName; title: string; text: string }) {
  return (
    <View style={styles.row}>
      <Icon name={icon} color={colors.muted} />
      <View style={{ flex: 1, gap: 4 }}>
        <Txt variant="label">{title}</Txt>
        <Txt variant="caption">{text}</Txt>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 12, marginTop: space.sm },
});
