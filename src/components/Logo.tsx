import { Text } from 'react-native';
import { colors, fonts } from '@/theme';

type Props = {
  size?: number;
  color?: string;
  dotColor?: string;
};

/** The wordmark: "naio" plus a coloured period. Always lowercase. */
export function Logo({ size = 40, color = colors.dark, dotColor = colors.brandDot }: Props) {
  return (
    <Text
      accessibilityRole="header"
      accessibilityLabel="naio."
      style={{
        fontFamily: fonts.sansBlack,
        fontSize: size,
        lineHeight: size * 1.15,
        color,
        letterSpacing: -size * 0.04,
      }}
    >
      naio<Text style={{ color: dotColor }}>.</Text>
    </Text>
  );
}
