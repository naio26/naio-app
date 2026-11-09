import { StyleSheet, View } from 'react-native';
import { Icon, type IconName } from './Icon';
import { colors, fonts } from '@/theme';
import { Txt } from './Txt';

type Props = {
  initials: string;
  size?: number;
  /** Background colour; defaults to peach with terracotta letters. */
  color?: string;
  verified?: boolean;
  serif?: boolean;
};

export function Avatar({ initials, size = 44, color, verified, serif }: Props) {
  const filled = !!color;
  return (
    <View style={{ width: size, height: size }}>
      <View
        style={[
          styles.circle,
          { width: size, height: size, borderRadius: size / 2, backgroundColor: color ?? colors.accentSoft },
        ]}
      >
        <Txt
          style={{
            fontFamily: serif ? fonts.serif : fonts.sansBold,
            fontSize: size * (serif ? 0.42 : 0.3),
            lineHeight: size * 0.6,
            color: filled ? colors.white : colors.accent,
          }}
        >
          {initials}
        </Txt>
      </View>
      {verified && (
        <View style={[styles.badge, { width: size * 0.26, height: size * 0.26, borderRadius: size * 0.13 }]}>
          <Icon name="check" size={size * 0.13} color={colors.white} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  circle: { alignItems: 'center', justifyContent: 'center' },
  badge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    minWidth: 18,
    minHeight: 18,
    backgroundColor: colors.green,
    borderWidth: 2,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
