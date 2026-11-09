import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Icon, type IconName } from './Icon';
import { colors, fonts } from '@/theme';
import { Txt } from './Txt';

/**
 * Your profile photo. The face check is fake, so there is no real picture yet:
 * we show your initial on the terracotta gradient from screen 20, with the green "verified" tick.
 */
export function ProfilePhoto({
  name,
  size = 150,
  verified = true,
}: {
  name: string;
  size?: number;
  verified?: boolean;
}) {
  const initial = name.trim().charAt(0).toUpperCase() || '·';
  const badge = size * 0.25;
  return (
    <View style={{ width: size, height: size }}>
      <LinearGradient
        colors={[colors.brandGlow, colors.accentFill, colors.brandBandDeep]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={[styles.circle, { borderRadius: size / 2 }]}
      >
        <Txt style={{ fontFamily: fonts.serif, fontSize: size * 0.45, lineHeight: size * 0.6, color: colors.white }}>
          {initial}
        </Txt>
      </LinearGradient>
      {verified && (
        <View style={[styles.badge, { width: badge, height: badge, borderRadius: badge / 2 }]}>
          <Icon name="check" size={badge * 0.5} color={colors.white} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  circle: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  badge: {
    position: 'absolute',
    right: 0,
    bottom: 4,
    backgroundColor: colors.green,
    borderWidth: 3,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
