import { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';
import { colors, space } from '@/theme';

type Props = {
  children: ReactNode;
  /** Pinned to the bottom (main action button). */
  footer?: ReactNode;
  /** Shown above the scrolling content, without side padding (ScreenHeader). */
  header?: ReactNode;
  scroll?: boolean;
  padded?: boolean;
  background?: string;
  edges?: Edge[];
  contentStyle?: StyleProp<ViewStyle>;
};

/** Cream page with safe areas, optional scroll and a bottom action area. */
export function Screen({
  children,
  footer,
  header,
  scroll = false,
  padded = true,
  background = colors.cream,
  edges = ['top', 'bottom'],
  contentStyle,
}: Props) {
  const inner = [padded && styles.padded, contentStyle];
  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: background }]} edges={edges}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {header}
        {scroll ? (
          <ScrollView
            style={styles.flex}
            contentContainerStyle={[styles.grow, inner]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        ) : (
          <View style={[styles.flex, inner]}>{children}</View>
        )}
        {footer && <View style={styles.footer}>{footer}</View>}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  grow: { flexGrow: 1 },
  padded: { paddingHorizontal: space.gutter },
  footer: { paddingHorizontal: space.gutter, paddingTop: space.md, paddingBottom: space.sm },
});
