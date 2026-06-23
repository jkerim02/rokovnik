/** Field — označeno tekstualno polje vezano za temu. */
import {
  StyleSheet,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';

import { useTheme } from '@/theme';
import { Text } from './Text';

type Props = TextInputProps & { label?: string };

export function Field({ label, style, ...rest }: Props) {
  const { theme } = useTheme();
  return (
    <View style={styles.wrap}>
      {label ? (
        <Text variant="label" color={theme.muted} style={styles.label}>
          {label}
        </Text>
      ) : null}
      <TextInput
        placeholderTextColor={theme.muted}
        {...rest}
        style={[
          styles.input,
          {
            backgroundColor: theme.surface,
            borderColor: theme.line,
            color: theme.ink,
          },
          style,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 14 },
  label: { marginBottom: 6 },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
});
