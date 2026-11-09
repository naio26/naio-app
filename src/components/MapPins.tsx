import { Pressable, StyleSheet, View } from 'react-native';
import { Icon, type IconName } from './Icon';
import { colors, fonts, shadow } from '@/theme';
import { Avatar } from './Avatar';
import { project } from './FakeMap';
import { Txt } from './Txt';

type LatLng = { latitude: number; longitude: number };

/** A plan on the map: a green pill with the time ("TODAY 6 PM", "NOW"). Yours is terracotta. */
export function PlanPin({
  location,
  label,
  mine,
  selected,
  onPress,
}: {
  location: LatLng;
  label: string;
  mine?: boolean;
  selected?: boolean;
  onPress: () => void;
}) {
  // Green = "Plan to join" (yours too: the ★ and the label tell it apart).
  const bg = colors.mapPlan;
  const fg = colors.white;
  return (
    <View style={[styles.planWrap, project(location), selected && { zIndex: 5 }]} pointerEvents="box-none">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Plan, ${label}`}
        onPress={onPress}
        style={({ pressed }) => [
          styles.pill,
          { backgroundColor: bg },
          selected && styles.selected,
          pressed && { transform: [{ scale: 0.96 }] },
        ]}
      >
        {mine && <Icon name="star" size={12} color={fg} />}
        <Txt numberOfLines={1} style={[styles.pillText, { color: fg }]}>
          {label}
        </Txt>
      </Pressable>
      <View style={[styles.tip, { borderTopColor: bg }]} />
    </View>
  );
}

/** Someone open to plans (no plan of their own): an orange marker with their initial. */
export function PersonPin({
  location,
  initials,
  name,
  color,
  selected,
  onPress,
}: {
  location: LatLng;
  initials: string;
  name: string;
  color?: string;
  selected?: boolean;
  onPress: () => void;
}) {
  return (
    <View style={[styles.personWrap, project(location)]} pointerEvents="box-none">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${name}, open to plans`}
        onPress={onPress}
        style={[styles.ring, selected && { borderColor: colors.accentLine }]}
      >
        <Avatar initials={initials} size={38} color={colors.mapOpen} />
      </Pressable>
      <Txt style={styles.personName}>{name}</Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  planWrap: { position: 'absolute', width: 220, marginLeft: -110, marginTop: -44, alignItems: 'center' },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    height: 38,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: 'transparent',
    ...shadow.soft,
  },
  selected: { borderColor: colors.white, transform: [{ scale: 1.08 }] },
  pillText: {
    fontFamily: fonts.sansBold,
    fontSize: 12,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: colors.white,
  },
  tip: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 7,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  personWrap: { position: 'absolute', width: 90, marginLeft: -45, marginTop: -22, alignItems: 'center', gap: 3 },
  ring: { borderRadius: 24, borderWidth: 3, borderColor: colors.white, ...shadow.soft },
  personName: { fontFamily: fonts.sansBold, fontSize: 11, color: colors.dark },
});
