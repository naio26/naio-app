import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Icon, type IconName } from '@/components';
import { Button, CodeBadge, Screen, ScreenHeader, Txt } from '@/components';
import { LANGUAGE_LEVELS } from '@/data/catalog';
import { LanguageLevel } from '@/data/types';
import { useProfile } from '@/state/profile';
import { colors, fonts, radius, shadow, space } from '@/theme';

// Screen 17 — a level for every language, and one of them is your native language.
export default function LanguageLevels() {
  const { profile, update } = useProfile();
  const [open, setOpen] = useState<string | null>(null);
  const langs = profile.languages;

  const setLevel = (code: string, level: LanguageLevel) => {
    update({ languages: langs.map((l) => (l.code === code ? { ...l, level } : l)) });
    setOpen(null);
  };

  const allSet = langs.every((l) => l.level);
  const hasNative = langs.some((l) => l.level === 'Native');
  const hint = !allSet ? 'Set a level for every language.' : !hasNative ? 'Pick one language as Native.' : undefined;

  return (
    <Screen
      scroll
      header={<ScreenHeader eyebrow="Your profile" title="Add your level" />}
      contentStyle={styles.content}
      footer={
        <View style={{ gap: 8 }}>
          {hint && (
            <Txt variant="caption" center>
              {hint}
            </Txt>
          )}
          <Button title="Save languages" arrow disabled={!!hint} onPress={() => router.dismissTo('/setup/profile')} />
        </View>
      }
    >
      <Txt>Choose one native language and set the level for every other language you speak.</Txt>

      {langs.map((l) => {
        const isOpen = open === l.code;
        return (
          <View key={l.code} style={[styles.cardWrap, isOpen && styles.raised]}>
            <View style={[styles.card, isOpen && styles.cardOpen]}>
              <CodeBadge code={l.code} strong />
              <Txt variant="bodyStrong" style={{ flex: 1, fontSize: 18 }}>
                {l.name}
              </Txt>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`${l.name} level: ${l.level ?? 'not set'}`}
                onPress={() => setOpen(isOpen ? null : l.code)}
                style={[styles.pill, !l.level && styles.pillEmpty]}
              >
                <Txt style={styles.pillText}>{l.level ?? 'Set level'}</Txt>
                <Icon name={isOpen ? 'chevron-up' : 'chevron-down'} color={colors.accent} />
              </Pressable>
            </View>

            {isOpen && (
              <View style={styles.menu}>
                {LANGUAGE_LEVELS.map((lv) => {
                  const on = l.level === lv;
                  return (
                    <Pressable key={lv} onPress={() => setLevel(l.code, lv)} style={[styles.item, on && styles.itemOn]}>
                      <Txt style={[styles.itemText, on && { color: colors.accent }]}>{lv}</Txt>
                      {on && <Icon name="check" color={colors.accent} />}
                    </Pressable>
                  );
                })}
              </View>
            )}
          </View>
        );
      })}

      {langs.length === 0 && <Txt>No languages yet. Go back and pick at least one.</Txt>}
      {/* Room for the last dropdown to open. */}
      <View style={{ height: 160 }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: space.xl, gap: space.lg },
  cardWrap: { zIndex: 1 },
  raised: { zIndex: 10, elevation: 10 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    paddingHorizontal: 26,
    height: 96,
    borderRadius: radius.lg + 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  cardOpen: { borderColor: colors.accentLine, ...shadow.soft },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 46,
    paddingHorizontal: 18,
    borderRadius: 18,
    backgroundColor: colors.accentSoft,
  },
  pillEmpty: { backgroundColor: colors.white, borderWidth: 1.5, borderColor: colors.accentLine },
  pillText: { fontFamily: fonts.sansBold, fontSize: 14, color: colors.accent },
  menu: {
    position: 'absolute',
    top: 88,
    right: 12,
    width: 200,
    padding: 8,
    borderRadius: radius.md + 2,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cream,
    ...shadow.soft,
    elevation: 12,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 46,
    borderRadius: 12,
  },
  itemOn: { backgroundColor: colors.accentSoft },
  itemText: { fontFamily: fonts.sansBold, fontSize: 15, color: colors.dark },
});
