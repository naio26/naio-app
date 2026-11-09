import { Modal, StyleSheet, View } from 'react-native';
import { colors, fonts, radius, space } from '@/theme';
import { Button } from './Button';
import { Txt } from './Txt';

type Props = {
  visible: boolean;
  onSetFilters: () => void;
  onSkip: () => void;
};

/** Screen 22 — "What are you up to?" card over the map, shown once after the welcome. */
export function UpToCard({ visible, onSetFilters, onSkip }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent onRequestClose={onSkip}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Txt variant="eyebrow" style={{ letterSpacing: 3 }}>
            First things first
          </Txt>
          <Txt style={styles.title}>What are you{'\n'}up to?</Txt>
          <Txt style={styles.sub}>Customize your experience to set the perfect plan.</Txt>
          <Button title="Set filters" arrow onPress={onSetFilters} style={styles.cta} />
          <Button title="Skip for now" variant="link" onPress={onSkip} />
          <Txt variant="caption" center style={{ marginTop: -6 }}>
            See all active nearby plans without personal filters.
          </Txt>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(60, 54, 50, 0.72)', justifyContent: 'center', padding: space.xl + 6 },
  card: {
    backgroundColor: colors.cream,
    borderRadius: radius.lg + 14,
    paddingHorizontal: 30,
    paddingTop: 40,
    paddingBottom: 28,
    gap: 14,
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 52,
    lineHeight: 58,
    color: colors.dark,
    letterSpacing: -0.5,
    marginTop: 4,
  },
  sub: { fontFamily: fonts.sans, fontSize: 18, lineHeight: 26, color: colors.accent },
  cta: { marginTop: space.lg, minHeight: 60 },
});
