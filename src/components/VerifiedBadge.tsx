import { StyleSheet, View } from 'react-native';
import { colors, shadow } from '@/theme';
import { Icon } from './Icon';
import { Txt } from './Txt';

/**
 * Small, discreet "everyone is verified" reminder (replaces the box that was at the end of the filters).
 * pill: floating on the map, like the colour legend. plain: a quiet line, e.g. above "Join plan".
 */
export function VerifiedBadge({ variant = 'plain' }: { variant?: 'pill' | 'plain' }) {
  return (
    <View style={[styles.row, variant === 'pill' && styles.pill]}>
      <Icon name="shield-check" size={14} color={colors.green} />
      <Txt variant="caption" color={variant === 'pill' ? colors.dark : colors.muted}>
        Everyone is age and selfie verified
      </Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  pill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: colors.cream,
    ...shadow.soft,
  },
});
