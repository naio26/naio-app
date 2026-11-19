import { Text } from 'react-native';
import { colors, fonts } from '@/theme';

type Props = {
  size?: number;
  /** 'light' = the same logo all in cream, for coloured backgrounds and photos. */
  tone?: 'default' | 'light';
};

/**
 * The one and only "naio." wordmark: DM Sans ExtraBold, lowercase, coloured period.
 * Every screen uses this component; only the size and the tone change, never the font or colours.
 */
export function Logo({ size = 40, tone = 'default' }: Props) {
  const light = tone === 'light';
  return (
    <Text
      accessibilityRole="header"
      accessibilityLabel="naio."
      style={{
        fontFamily: fonts.sansBlack,
        fontSize: size,
        lineHeight: size * 1.15,
        color: light ? colors.cream : colors.dark,
        letterSpacing: -size * 0.04,
      }}
    >
      naio<Text style={{ color: light ? colors.cream : colors.brandDot }}>.</Text>
    </Text>
  );
}
