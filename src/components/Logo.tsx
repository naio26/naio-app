import { Text } from 'react-native';
import { colors, fonts } from '@/theme';

/** THE logo size: the same on every screen. Change it only here. */
export const LOGO_SIZE = 30;

type Props = {
  /** 'light' = the same logo all in cream, for coloured backgrounds and photos. */
  tone?: 'default' | 'light';
};

/**
 * The one and only "naio." wordmark: DM Sans ExtraBold, lowercase, coloured period.
 * Every screen uses this component at the same size (LOGO_SIZE); only the tone can change, never the size, font or colours.
 */
export function Logo({ tone = 'default' }: Props) {
  const light = tone === 'light';
  const size = LOGO_SIZE;
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
