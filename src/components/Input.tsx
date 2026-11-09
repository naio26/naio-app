import { useState } from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import { colors, fonts, radius } from '@/theme';
import { Txt } from './Txt';

type Props = TextInputProps & {
  label?: string;
  error?: string;
};

export function Input({ label, error, style, onFocus, onBlur, ...rest }: Props) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.wrap}>
      {label && <Txt variant="label">{label}</Txt>}
      <TextInput
        placeholderTextColor={colors.faint}
        style={[styles.input, focused && styles.focused, error ? styles.errorBorder : null, style]}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        {...rest}
      />
      {error && (
        <Txt variant="small" color={colors.danger}>
          {error}
        </Txt>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 8 },
  input: {
    height: 52,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    fontFamily: fonts.sans,
    fontSize: 16,
    color: colors.dark,
  },
  focused: { borderColor: colors.accentLine },
  errorBorder: { borderColor: colors.danger },
});
