/** Screen — osnovni omotač ekrana sa temom i safe-area insetom. */
import { type ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/theme';

type ScreenProps = {
  children: ReactNode;
  scroll?: boolean;
  style?: ViewStyle;
  /** padding sa strana (default 16) */
  padded?: boolean;
};

export function Screen({ children, scroll, style, padded = true }: ScreenProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const inner: ViewStyle = {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: padded ? 16 : 0,
    paddingTop: insets.top,
  };

  if (scroll) {
    return (
      <ScrollView
        style={{ backgroundColor: theme.bg }}
        contentContainerStyle={[
          { paddingHorizontal: padded ? 16 : 0, paddingTop: insets.top, paddingBottom: 32 },
          style,
        ]}
        keyboardShouldPersistTaps="handled">
        {children}
      </ScrollView>
    );
  }

  return <View style={[styles.flex, inner, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
