import { Text, TextProps } from 'react-native';
import { type, TypeVariant } from '@/theme';

type Props = TextProps & {
  variant?: TypeVariant;
  color?: string;
  center?: boolean;
};

/** Every piece of text in the app goes through here, so fonts stay consistent. */
export function Txt({ variant = 'body', color, center, style, ...rest }: Props) {
  return (
    <Text style={[type[variant], color ? { color } : null, center ? { textAlign: 'center' } : null, style]} {...rest} />
  );
}
