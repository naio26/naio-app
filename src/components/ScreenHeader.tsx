import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, space } from '@/theme';
import { BackButton } from './BackButton';
import { Txt } from './Txt';

type Props = {
  eyebrow?: string;
  title: string;
  back?: boolean;
  onBack?: () => void;
  /** Something on the right, e.g. "Reset" on the filters sheet. */
  right?: ReactNode;
  /** Bigger serif title (filters sheet). */
  large?: boolean;
};

/** Eyebrow + serif title with a back chevron and a divider underneath (screens 09–19, 43, 44). */
export function ScreenHeader({ eyebrow, title, back = true, onBack, right, large }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        {back && (
          <View style={styles.back}>
            <BackButton onPress={onBack} />
          </View>
        )}
        <View style={{ flex: 1, gap: 6 }}>
          {eyebrow && <Txt variant="eyebrow">{eyebrow}</Txt>}
          <Txt
            variant="h1"
            style={[styles.title, large && styles.large]}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.7}
          >
            {title}
          </Txt>
        </View>
        {right}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: space.gutter,
    paddingTop: space.lg,
    paddingBottom: space.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: 12 },
  back: { paddingBottom: 4 },
  title: { fontSize: 30, lineHeight: 36 },
  large: { fontSize: 40, lineHeight: 46 },
});
