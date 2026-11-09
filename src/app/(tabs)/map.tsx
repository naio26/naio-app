import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Icon, type IconName } from '@/components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  AvatarStack,
  BottomSheet,
  Button,
  Chip,
  FakeMap,
  InfoBox,
  MeetingPoint,
  PersonPin,
  PlanActions,
  PlanBadge,
  PlanFacts,
  PlanPin,
  Txt,
  UpToCard,
  YouMarker,
} from '@/components';
import { listAvailablePeople } from '@/data/api';
import { CITY } from '@/data/catalog';
import { useLoad } from '@/data/hooks';
import { formatTime, matchesFilters, pinLabel, planWhen } from '@/data/time';
import { Person, Plan } from '@/data/types';
import { countActive, NO_FILTERS, useFilters } from '@/state/filters';
import { usePeople } from '@/state/people';
import { usePlans } from '@/state/plans';
import { useSafety } from '@/state/safety';
import { useProfile } from '@/state/profile';
import { colors, fonts, radius, shadow, space } from '@/theme';

type Selected = { kind: 'plan'; plan: Plan } | { kind: 'person'; person: Person } | null;

// Screens 25 (live map), 26 (plan on map) and 28 (available person).
export default function MapTab() {
  const insets = useSafeAreaInsets();
  const { profile, created } = useProfile();
  const { filters, setFilters, introSeen, setIntroSeen } = useFilters();
  const { plans, statusOf } = usePlans();
  const { blocked, offline, setOffline } = useSafety();
  // Blocked people disappear from your map, with their plans.
  const available = (useLoad(listAvailablePeople, []) ?? []).filter((p) => !blocked.includes(p.id));
  const [selected, setSelected] = useState<Selected>(null);
  const active = countActive(filters);

  // Your own plan always shows; other plans follow the filters.
  const visible = useMemo(
    () => plans.filter((p) => statusOf(p) === 'host' || (!blocked.includes(p.hostId) && matchesFilters(p, filters))),
    [plans, filters, statusOf, blocked],
  );
  const others = visible.filter((p) => statusOf(p) !== 'host').length;

  return (
    <View style={styles.root}>
      <FakeMap onPressMap={() => setSelected(null)}>
        {available.map((p) => (
          <PersonPin
            key={p.id}
            location={p.available!.location}
            initials={p.initials}
            name={p.firstName}
            color={p.avatarColor}
            selected={selected?.kind === 'person' && selected.person.id === p.id}
            onPress={() => setSelected({ kind: 'person', person: p })}
          />
        ))}
        <YouMarker />
        {visible.map((p) => (
          <PlanPin
            key={p.id}
            location={p.location}
            label={statusOf(p) === 'host' ? `Your plan · ${formatTime(p.time, true)}` : pinLabel(p)}
            mine={statusOf(p) === 'host'}
            selected={selected?.kind === 'plan' && selected.plan.id === p.id}
            onPress={() => setSelected({ kind: 'plan', plan: p })}
          />
        ))}
      </FakeMap>

      {/* Greeting card + filters */}
      <View style={[styles.top, { top: insets.top + 10 }]}>
        <View style={{ flex: 1 }}>
          <Txt variant="caption">Hi {profile.firstName || 'there'}</Txt>
          <Txt style={styles.city}>{CITY}</Txt>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={active ? `Filters, ${active} on` : 'Filters'}
          onPress={() => router.push('/filters')}
          hitSlop={10}
          style={({ pressed }) => [styles.filterBtn, pressed && { opacity: 0.6 }]}
        >
          <Icon name="sliders" color={active ? colors.accent : colors.dark} />
          {active > 0 && (
            <View style={styles.count}>
              <Txt style={styles.countText}>{active}</Txt>
            </View>
          )}
        </Pressable>
      </View>

      {/* Map colour code: green = plans, orange = people open to plans. */}
      <View style={[styles.legend, { top: insets.top + 96 }]} pointerEvents="none">
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.mapPlan }]} />
          <Txt variant="caption" color={colors.dark}>
            Plan to join
          </Txt>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.mapOpen }]} />
          <Txt variant="caption" color={colors.dark}>
            Open to plans
          </Txt>
        </View>
      </View>

      {offline && (
        <View style={[styles.offline, { top: insets.top + 136 }]}>
          <Txt variant="small" color={colors.white} style={{ flex: 1 }}>
            You’re offline and hidden from the map.
          </Txt>
          <Pressable hitSlop={10} onPress={() => setOffline(false)}>
            <Txt variant="label" color={colors.white}>
              Go online
            </Txt>
          </Pressable>
        </View>
      )}

      {/* Hint, or "nothing matches" when the filters hide every plan */}
      {!selected &&
        (others > 0 ? (
          <View style={styles.hint} pointerEvents="none">
            <Txt variant="small" color={colors.dark}>
              {others} {others === 1 ? 'plan' : 'plans'} nearby · {available.length}{' '}
              {available.length === 1 ? 'person' : 'people'} available
            </Txt>
          </View>
        ) : (
          plans.length > 0 && (
            <View style={styles.empty}>
              <Txt variant="bodyStrong">No plans match your filters right now.</Txt>
              <Txt variant="small">Try a wider distance or another time.</Txt>
              <View style={{ flexDirection: 'row', gap: 10, marginTop: 6 }}>
                <Button
                  title="Change filters"
                  variant="outline"
                  onPress={() => router.push('/filters')}
                  style={{ flex: 1, minHeight: 46 }}
                />
                <Button title="Show all" onPress={() => setFilters(NO_FILTERS)} style={{ flex: 1, minHeight: 46 }} />
              </View>
            </View>
          )
        ))}

      <BottomSheet visible={!!selected} onClose={() => setSelected(null)}>
        {selected?.kind === 'plan' && <PlanSheet plan={selected.plan} />}
        {selected?.kind === 'person' && <PersonSheet person={selected.person} />}
      </BottomSheet>

      {/* Screen 22: shown once, right after the welcome. */}
      <UpToCard
        visible={created && !introSeen}
        onSkip={() => setIntroSeen(true)}
        onSetFilters={() => {
          setIntroSeen(true);
          // Let the card fade out before the filters sheet slides up.
          setTimeout(() => router.push('/filters'), 250);
        }}
      />
    </View>
  );
}

/** Screen 26 — a plan tapped on the map. */
function PlanSheet({ plan }: { plan: Plan }) {
  const { statusOf, membersOf } = usePlans();
  const status = statusOf(plan);
  const memberIds = membersOf(plan);
  const members = usePeople(memberIds);
  const host = members.find((m) => m.id === plan.hostId);

  return (
    <View style={{ gap: space.lg }}>
      <View style={{ gap: 6 }}>
        <PlanBadge status={status} />
        <Txt variant="eyebrow" style={{ letterSpacing: 1.2 }}>
          {planWhen(plan)}
        </Txt>
        <Txt variant="h1">{plan.title}</Txt>
        <Txt variant="bodyStrong">
          {plan.area} · {plan.distanceKm} km
        </Txt>
        <Txt style={{ marginTop: 4 }}>{plan.tagline}</Txt>
      </View>
      <PlanFacts plan={plan} going={memberIds.length} />
      <AvatarStack people={members} />
      <MeetingPoint plan={plan} status={status} />
      <PlanActions
        plan={plan}
        status={status}
        host={host}
        going={memberIds.length}
        secondary={{
          title: 'View details',
          onPress: () => router.push({ pathname: '/plan/[id]', params: { id: plan.id } }),
        }}
      />
    </View>
  );
}

/** Screen 28 — someone available without a plan. You can't message them. */
function PersonSheet({ person }: { person: Person }) {
  const a = person.available!;
  return (
    <View style={{ gap: space.lg }}>
      <View style={{ gap: 8 }}>
        <Txt variant="eyebrow" style={{ letterSpacing: 1.2 }}>
          Available
        </Txt>
        <Txt variant="h1">
          {person.firstName}, {person.ageRange}
        </Txt>
        <Txt variant="small" style={{ fontSize: 14 }}>
          {a.stay} · until {formatTime(a.until)}
        </Txt>
      </View>
      {person.about && <Txt>{person.about}</Txt>}
      <View style={styles.tags}>
        {person.interests.map((i) => (
          <Chip key={i} label={i} size="sm" selected />
        ))}
      </View>
      <Txt variant="bodyStrong">{person.languages.map((l) => l.name).join(' · ')}</Txt>
      <InfoBox
        text={`${person.firstName} hasn’t created a plan but seems to be in a similar mood. You can’t message them directly. They’ll be notified when a nearby plan matches their filters.`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.mapLand },
  top: {
    position: 'absolute',
    left: space.lg,
    right: space.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: radius.lg,
    backgroundColor: colors.cream,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.soft,
  },
  city: { fontFamily: fonts.serif, fontSize: 26, lineHeight: 32, color: colors.dark },
  filterBtn: { padding: 6 },
  count: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.accentFill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  countText: { fontFamily: fonts.sansBold, fontSize: 11, color: colors.white },
  hint: {
    position: 'absolute',
    bottom: space.lg,
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: colors.cream,
    ...shadow.soft,
  },
  empty: {
    position: 'absolute',
    bottom: space.lg,
    left: space.lg,
    right: space.lg,
    gap: 4,
    padding: 20,
    borderRadius: radius.lg,
    backgroundColor: colors.cream,
    ...shadow.soft,
  },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  legend: {
    position: 'absolute',
    left: space.lg,
    flexDirection: 'row',
    gap: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.cream,
    ...shadow.soft,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  offline: {
    position: 'absolute',
    left: space.lg,
    right: space.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: radius.md,
    backgroundColor: colors.accentDeep,
  },
});
