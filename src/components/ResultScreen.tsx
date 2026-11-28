import { ReactNode } from 'react';
import { StyleSheet, View, StyleProp, ViewStyle } from 'react-native';
import { Icon, type IconName } from './Icon';
import { colors, icon as iconSize, space } from '@/theme';
import { Card } from './Card';
import { Logo } from './Logo';
import { Screen } from './Screen';
import { Txt } from './Txt';

/** Logo, round icon, big title, a summary card and a note: "Plan posted." (30), "Plan cancelled." (34). */
export function ResultScreen({
  icon,
  eyebrow,
  title,
  cardTitle,
  lines,
  note,
  footer,
  cardStyle,
}: {
  icon: IconName;
  eyebrow?: string;
  title: string;
  cardTitle: string;
  lines: string[];
  note: string;
  footer: ReactNode;
  /** e.g. the soft red border of a cancelled plan. */
  cardStyle?: StyleProp<ViewStyle>;
}) {
  return (
    <Screen contentStyle={styles.content} footer={footer}>
      <Logo />
      <View style={styles.center}>
        <View style={styles.hero}>
          <Icon name={icon} size={iconSize.hero} color={colors.accent} />
        </View>
        {eyebrow && (
          <Txt variant="eyebrow" style={{ letterSpacing: 1.6 }}>
            {eyebrow}
          </Txt>
        )}
        <Txt variant="display" center>
          {title}
        </Txt>
      </View>
      <Card style={[styles.card, cardStyle]}>
        <Txt variant="bodyStrong" style={{ fontSize: 18 }}>
          {cardTitle}
        </Txt>
        {lines.map((l) => (
          <Txt key={l} variant="small">
            {l}
          </Txt>
        ))}
      </Card>
      <Txt variant="small" center style={{ fontSize: 14 }}>
        {note}
      </Txt>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: space.xl, gap: space.xl },
  center: { alignItems: 'center', gap: 14, marginTop: space.xl },
  hero: { marginBottom: space.sm },
  card: { gap: 10, padding: 22, marginTop: space.md },
});
