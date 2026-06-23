/** Card — površina sa ivicom u boji teme. */
import { type ReactNode } from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';

import { useTheme } from '@/theme';

type CardProps = {
  children: ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
};

export function Card({ children, onPress, style }: CardProps) {
  const { theme } = useTheme();
  const base: ViewStyle = {
    backgroundColor: theme.surface,
    borderColor: theme.line,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    padding: 14,
  };

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [base, style, pressed && { opacity: 0.7 }]}>
        {children}
      </Pressable>
    );
  }
  return <View style={[base, style]}>{children}</View>;
}
