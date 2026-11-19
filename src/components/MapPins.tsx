import { StyleSheet, View } from 'react-native';
import { Icon } from './Icon';
import { colors, fonts, shadow } from '@/theme';
import { Avatar } from './Avatar';
import { Txt } from './Txt';

// What the map markers look like. Where they sit (and taps) is handled by <MapMarker> in NaioMap.
// Map colour code: GREEN = "Plan to join" (every plan, yours too), ORANGE = "Open to plans".

/** Height of each marker and where its point is (px from the top), so the map can pin it to the coordinate. */
export const PIN_SIZE = {
  plan: { height: 56, anchorY: 56 }, // the tip at the bottom
  person: { height: 80, anchorY: 22 }, // the centre of the circle
  you: { height: 76, anchorY: 24 }, // the centre of the blue dot
};

/** A plan: green pill, "Today" / "Tomorrow" on top and the time below. Yours adds ★ "Your plan". */
export function PlanPin({
  day,
  time,
  mine,
  selected,
}: {
  day: string;
  time: string;
  mine?: boolean;
  selected?: boolean;
}) {
  return (
    <View style={styles.planWrap}>
      <View style={[styles.pill, selected && styles.selected]}>
        <View style={styles.pillTop}>
          {mine && <Icon name="star" size={10} color={colors.white} />}
          <Txt numberOfLines={1} style={styles.pillDay}>
            {mine ? `Your plan · ${day}` : day}
          </Txt>
        </View>
        <Txt numberOfLines={1} style={styles.pillTime}>
          {time}
        </Txt>
      </View>
      <View style={styles.tip} />
    </View>
  );
}

/** Someone open to plans (no plan of their own): orange circle, then name and age range. */
export function PersonPin({
  initials,
  name,
  ageRange,
  selected,
}: {
  initials: string;
  name: string;
  ageRange: string;
  selected?: boolean;
}) {
  return (
    <View style={styles.personWrap}>
      <View style={[styles.ring, selected && styles.ringOn]}>
        <Avatar initials={initials} size={38} color={colors.mapOpen} />
      </View>
      <View style={styles.nameTag}>
        <Txt numberOfLines={1} style={styles.personName}>
          {name}
        </Txt>
        <Txt numberOfLines={1} style={styles.personAge}>
          {ageRange}
        </Txt>
      </View>
    </View>
  );
}

/** You, approximately: the blue dot. "You (approximate)" only shows after tapping it. */
export function YouDot({ showLabel }: { showLabel: boolean }) {
  return (
    <View style={styles.youWrap}>
      <View style={styles.halo}>
        <View style={styles.dot} />
      </View>
      <View style={[styles.youTag, !showLabel && { opacity: 0 }]}>
        <Txt style={styles.youText}>You (approximate)</Txt>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  planWrap: { height: PIN_SIZE.plan.height, alignItems: 'center', justifyContent: 'flex-end', paddingHorizontal: 4 },
  pill: {
    minWidth: 76,
    height: 46,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: colors.mapPlan,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.soft,
  },
  selected: { borderColor: colors.white },
  pillTop: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  pillDay: {
    fontFamily: fonts.sansMedium,
    fontSize: 10.5,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: colors.white,
  },
  pillTime: { fontFamily: fonts.sansBold, fontSize: 14, lineHeight: 18, color: colors.white },
  tip: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: colors.mapPlan,
  },
  personWrap: { height: PIN_SIZE.person.height, width: 96, alignItems: 'center', gap: 3 },
  ring: { borderRadius: 24, borderWidth: 3, borderColor: colors.white, ...shadow.soft },
  ringOn: { borderColor: colors.mapOpen, transform: [{ scale: 1.08 }] },
  nameTag: {
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 250, 246, 0.92)',
  },
  personName: { fontFamily: fonts.sansBold, fontSize: 11, lineHeight: 14, color: colors.dark },
  personAge: { fontFamily: fonts.sans, fontSize: 10, lineHeight: 13, color: colors.muted },
  youWrap: { height: PIN_SIZE.you.height, width: 140, alignItems: 'center', gap: 4 },
  halo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.youHalo,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.you,
    borderWidth: 3,
    borderColor: colors.white,
  },
  youTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: colors.cream,
    ...shadow.soft,
  },
  youText: { fontFamily: fonts.sansBold, fontSize: 11, color: colors.dark },
});
