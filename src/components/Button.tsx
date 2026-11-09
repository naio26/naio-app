import { ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Icon, type IconName } from './Icon';
import { colors, fonts, icon as iconSize, radius, shadow } from '@/theme';
import { Txt } from './Txt';

type Variant = 'primary' | 'outline' | 'social' | 'glow' | 'link' | 'danger';

type Props = {
  title: string;
  onPress?: () => void;
  variant?: Variant;
  /** Shows → on the right (primary buttons), or › with 'chevron' (reel button). */
  arrow?: boolean | 'chevron';
  /** Icon or logo shown before the title (social buttons). */
  icon?: ReactNode;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
};

const looks: Record<Variant, { bg: string; fg: string; border?: string }> = {
  primary: { bg: colors.accentFill, fg: colors.white },
  danger: { bg: colors.danger, fg: colors.white },
  outline: { bg: 'transparent', fg: colors.accent, border: colors.accent },
  social: { bg: colors.white, fg: colors.dark, border: colors.border },
  glow: { bg: 'transparent', fg: colors.dark }, // light mustard gradient (intro "Get started")
  link: { bg: 'transparent', fg: colors.muted },
};

export function Button({ title, onPress, variant = 'primary', arrow, icon, disabled, loading, style }: Props) {
  const look = looks[variant];
  const isSolid = variant === 'primary' || variant === 'danger';
  const bg = disabled && isSolid ? colors.disabled : look.bg;
  // Big primary buttons are left-aligned with an arrow; the rest are centred.
  const spread = !!arrow;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        variant === 'link' && styles.link,
        variant === 'social' && styles.social,
        variant === 'glow' && styles.glow,
        { backgroundColor: bg },
        look.border ? { borderWidth: variant === 'outline' ? 1.5 : 1, borderColor: look.border } : null,
        isSolid && !disabled && shadow.button,
        spread ? styles.spread : styles.centered,
        pressed && { opacity: 0.85, transform: [{ scale: 0.99 }] },
        style,
      ]}
    >
      {variant === 'glow' && (
        <LinearGradient
          colors={[colors.glowFrom, colors.glowTo]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      )}
      {loading ? (
        <ActivityIndicator color={look.fg} />
      ) : (
        <>
          <View style={styles.row}>
            {icon}
            <Txt
              variant="button"
              color={look.fg}
              style={[
                variant === 'social' && { fontSize: 17 },
                variant === 'outline' && { fontSize: 17 },
                variant === 'link' && { fontFamily: fonts.sans, fontSize: 17 },
                variant === 'glow' && { fontSize: 20 },
              ]}
            >
              {title}
            </Txt>
          </View>
          {arrow && (
            <View>
              <Icon
                name={arrow === 'chevron' ? 'chevron-right' : 'arrow-right'}
                size={arrow === 'chevron' ? iconSize.tab : iconSize.size}
                color={look.fg}
              />
            </View>
          )}
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 56,
    borderRadius: radius.button,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  social: { minHeight: 48, borderRadius: radius.md },
  glow: { overflow: 'hidden' },
  link: { minHeight: 44 },
  spread: { justifyContent: 'space-between' },
  centered: { justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
});
