import { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Icon, type IconName } from './Icon';
import { colors, fonts, radius } from '@/theme';
import { Txt } from './Txt';

type Props = {
  label: string;
  placeholder: string;
  /** Text when something is chosen; the placeholder shows otherwise. */
  value?: string;
  /** Small line under the value, e.g. "Verified". */
  note?: ReactNode;
  icon?: IconName;
  /** Terracotta border to draw attention (languages and interests on screen 09). */
  highlight?: boolean;
  onPress: () => void;
};

/** A tappable field that opens another screen (age range, languages, interests on screen 09). */
export function SelectField({ label, placeholder, value, note, icon = 'chevron-down', highlight, onPress }: Props) {
  return (
    <View style={styles.wrap}>
      <Txt variant="section">{label}</Txt>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${value ?? placeholder}`}
        onPress={onPress}
        style={({ pressed }) => [styles.box, highlight && !value && styles.highlight, pressed && { opacity: 0.75 }]}
      >
        <View style={{ flex: 1, gap: 2 }}>
          <Txt numberOfLines={2} style={[styles.text, value ? styles.value : styles.placeholder]}>
            {value ?? placeholder}
          </Txt>
          {note}
        </View>
        <Icon name={icon} color={highlight ? colors.accent : colors.muted} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 10 },
  box: {
    minHeight: 56,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    paddingHorizontal: 18,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  highlight: { borderColor: colors.accentLine, borderWidth: 1.5 },
  text: { fontSize: 16, lineHeight: 22 },
  value: { fontFamily: fonts.sansBold, color: colors.dark },
  placeholder: { fontFamily: fonts.sans, color: colors.muted },
});
