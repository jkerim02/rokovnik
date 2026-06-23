/** EmptyState — poruka kad nema podataka. */
import { StyleSheet, View } from 'react-native';

import { Text } from './Text';

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <View style={styles.wrap}>
      <Text variant="heading" style={styles.title}>
        {title}
      </Text>
      {hint ? (
        <Text variant="muted" style={styles.hint}>
          {hint}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingVertical: 48, alignItems: 'center' },
  title: { textAlign: 'center' },
  hint: { textAlign: 'center', marginTop: 6 },
});
