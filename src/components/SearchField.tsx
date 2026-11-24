import { StyleSheet, TextInputProps, View } from 'react-native';
import { colors } from '@/theme';
import { Icon } from './Icon';
import { Input } from './Input';

/** A text field with the magnifying glass in front ("Search languages"). */
export function SearchField(props: TextInputProps) {
  return (
    <View>
      <Input autoCorrect={false} returnKeyType="search" {...props} style={[styles.search, props.style]} />
      <View pointerEvents="none" style={styles.icon}>
        <Icon name="search" color={colors.muted} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  search: { paddingLeft: 46, height: 56 },
  icon: { position: 'absolute', left: 18, top: 19 },
});
