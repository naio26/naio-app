import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { LANGUAGES, languagesFor } from '@/data/catalog';
import { useCity } from '@/state/city';
import { colors, space } from '@/theme';
import { Chip } from './Chip';
import { CodeBadge, OptionRow } from './OptionRow';
import { SearchField } from './SearchField';
import { Txt } from './Txt';

/**
 * Languages as chips (Filters and Create a plan work exactly the same): the current city's suggested
 * languages first, then any extra ones picked with "+ Add another language", a search over the fixed
 * `LANGUAGES` list (no free text, so names stay consistent). Tap a chip to select or unselect it.
 */
export function LanguagePicker({
  selected,
  onChange,
  size,
}: {
  selected: string[];
  onChange: (languages: string[]) => void;
  size?: 'sm';
}) {
  const city = useCity();
  // Suggested languages follow the city (Greek and English in Athens).
  const suggested = languagesFor(city.languages)
    .slice(0, city.languages.length)
    .map((l) => l.name);
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState('');

  const chips = [...suggested, ...selected.filter((l) => !suggested.includes(l))];
  const q = query.trim().toLowerCase();
  const matches = q
    ? LANGUAGES.filter((l) => !chips.includes(l.name) && (l.name.toLowerCase().includes(q) || l.code.toLowerCase() === q))
    : [];

  const add = (name: string) => {
    onChange([...selected, name]);
    setQuery('');
    setSearching(false);
  };

  return (
    <View style={{ gap: size === 'sm' ? space.sm : 16 }}>
      <View style={[styles.chips, size === 'sm' && { gap: 8 }]}>
        {chips.map((l) => {
          const on = selected.includes(l);
          return (
            <Chip
              key={l}
              size={size}
              label={l}
              selected={on}
              onPress={() => onChange(on ? selected.filter((x) => x !== l) : [...selected, l])}
            />
          );
        })}
      </View>
      {searching ? (
        <View style={{ gap: space.xs }}>
          <SearchField placeholder="Search languages" value={query} onChangeText={setQuery} autoFocus />
          {matches.map((l) => (
            <OptionRow
              key={l.code}
              label={l.name}
              selected={false}
              idleIcon="plus"
              leading={<CodeBadge code={l.code} />}
              onPress={() => add(l.name)}
            />
          ))}
          {!!q && matches.length === 0 && (
            <Txt variant="caption" style={{ paddingVertical: space.sm }}>
              No language called “{query.trim()}” yet.
            </Txt>
          )}
        </View>
      ) : (
        <Pressable accessibilityRole="button" hitSlop={8} onPress={() => setSearching(true)} style={styles.add}>
          <Txt variant="label" color={colors.accent}>
            + Add another language
          </Txt>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  add: { alignSelf: 'flex-start', paddingVertical: space.xs },
});
