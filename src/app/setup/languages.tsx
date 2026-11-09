import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Icon, type IconName } from '@/components';
import { Button, CodeBadge, Input, OptionRow, Screen, ScreenHeader, Txt } from '@/components';
import { LANGUAGES, POPULAR_LANGUAGES } from '@/data/catalog';
import { Language } from '@/data/types';
import { useProfile } from '@/state/profile';
import { colors, space } from '@/theme';

// Screen 16 — pick the languages you speak. Levels come next (17).
export default function Languages() {
  const { profile, update } = useProfile();
  const [query, setQuery] = useState('');
  const selected = profile.languages;

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return LANGUAGES.slice(0, POPULAR_LANGUAGES);
    return LANGUAGES.filter((l) => l.name.toLowerCase().includes(q) || l.code.toLowerCase() === q);
  }, [query]);

  const toggle = (lang: Language) => {
    const isOn = selected.some((l) => l.code === lang.code);
    update({ languages: isOn ? selected.filter((l) => l.code !== lang.code) : [...selected, { ...lang }] });
  };

  // Languages chosen through search stay visible on top, even when the search is cleared.
  const extra = query ? [] : selected.filter((s) => !list.some((l) => l.code === s.code));

  return (
    <Screen
      scroll
      header={<ScreenHeader eyebrow="Your profile" title="Languages you speak" />}
      contentStyle={styles.content}
      footer={
        <Button
          title={selected.length ? 'Continue' : 'Choose at least one'}
          arrow
          disabled={!selected.length}
          onPress={() => router.push('/setup/language-levels')}
        />
      }
    >
      <View>
        <Input
          placeholder="Search languages"
          value={query}
          onChangeText={setQuery}
          autoCorrect={false}
          returnKeyType="search"
          style={styles.search}
        />
        <Icon name="search" color={colors.muted} />
      </View>

      <Txt variant="caption" style={styles.heading}>
        {query ? 'Results' : 'Popular near you'}
      </Txt>

      <View>
        {[...extra, ...list].map((l) => {
          const on = selected.some((s) => s.code === l.code);
          return (
            <OptionRow
              key={l.code}
              label={l.name}
              selected={on}
              idleIcon="plus"
              leading={<CodeBadge code={l.code} />}
              onPress={() => toggle(l)}
            />
          );
        })}
        {list.length === 0 && <Txt style={{ paddingVertical: space.lg }}>No language called “{query}” yet.</Txt>}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: space.xl, paddingBottom: space.xl, gap: space.md },
  search: { paddingLeft: 46, height: 56 },
  searchIcon: { position: 'absolute', left: 18, top: 19 },
  heading: { letterSpacing: 1.6, textTransform: 'uppercase', marginTop: space.md, marginBottom: space.xs },
});
