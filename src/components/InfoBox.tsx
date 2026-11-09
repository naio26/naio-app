import { ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Icon, type IconName } from './Icon';
import { colors, fonts } from '@/theme';
import { Card } from './Card';
import { Txt } from './Txt';

type Props = {
  title?: string;
  /** Plain text, or ✓ lines when `checks` is given. */
  text?: string;
  checks?: string[];
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

/** Light grey box with a terracotta title ("Age verified by ID", "Before you continue"). */
export function InfoBox({ title, text, checks, children, style }: Props) {
  return (
    <Card tone="muted" style={[styles.box, style]}>
      {title && <Txt style={styles.title}>{title}</Txt>}
      {text && (
        <Txt variant="small" style={styles.text}>
          {text}
        </Txt>
      )}
      {checks && (
        <View style={{ gap: 8 }}>
          {checks.map((c) => (
            <CheckLine key={c} text={c} />
          ))}
        </View>
      )}
      {children}
    </Card>
  );
}

export function CheckLine({ text, color = colors.muted }: { text: string; color?: string }) {
  return (
    <View style={styles.line}>
      <Icon name="check" color={color} />
      <Txt variant="small" color={color} style={{ flex: 1 }}>
        {text}
      </Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { paddingHorizontal: 22, paddingVertical: 18, gap: 10 },
  title: { fontFamily: fonts.sansBold, fontSize: 16, color: colors.accent },
  text: { fontSize: 14, lineHeight: 20 },
  line: { flexDirection: 'row', alignItems: 'center', gap: 6 },
});
