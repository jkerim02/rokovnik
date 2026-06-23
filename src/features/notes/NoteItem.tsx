/** NoteItem — jedna bilješka: kategorija (tačka), stranica, tekst. */
import { StyleSheet, View } from 'react-native';

import { Card, Text } from '@/components/ui';
import type { Note } from '@/db/schema';
import { useTheme } from '@/theme';
import { categoryColor, categoryLabel } from './noteCategory';

export function NoteItem({
  note,
  onPress,
}: {
  note: Note;
  onPress?: () => void;
}) {
  const { theme } = useTheme();
  return (
    <Card onPress={onPress}>
      <View style={styles.head}>
        <View style={styles.tag}>
          <View
            style={[styles.dot, { backgroundColor: categoryColor(note.category) }]}
          />
          <Text variant="label" color={theme.muted}>
            {categoryLabel(note.category)}
          </Text>
        </View>
        {note.page != null ? (
          <Text variant="label" color={theme.muted}>
            str. {note.page}
          </Text>
        ) : null}
      </View>
      <Text style={{ marginTop: 6 }}>{note.text}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tag: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
});
