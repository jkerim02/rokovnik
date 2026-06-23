import { Stack, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Card, EmptyState, Screen, Text } from '@/components/ui';
import { booksRepo, sessionsRepo } from '@/db/repositories';
import {
  PERIOD_LABELS,
  PERIOD_ORDER,
  formatMinutes,
  minutesInPeriod,
  readingStreak,
  type Period,
} from '@/features/stats/computeStats';
import { useTheme } from '@/theme';

export default function StatsScreen() {
  const { theme } = useTheme();
  const [period, setPeriod] = useState<Period>('week');
  const [perDay, setPerDay] = useState<{ day: string; minutes: number }[]>([]);
  const [perBook, setPerBook] = useState<
    { title: string; minutes: number }[]
  >([]);
  const [loaded, setLoaded] = useState(false);

  useFocusEffect(
    useCallback(() => {
      void (async () => {
        const [days, books, byBook] = await Promise.all([
          sessionsRepo.minutesPerDay(),
          booksRepo.listBooks(),
          sessionsRepo.minutesPerBook(),
        ]);
        const titleById = new Map(books.map((b) => [b.id, b.title]));
        setPerDay(days);
        setPerBook(
          byBook
            .filter((r) => r.minutes > 0)
            .map((r) => ({
              title: r.bookId ? titleById.get(r.bookId) ?? 'Nepoznato' : 'Bez knjige',
              minutes: r.minutes,
            })),
        );
        setLoaded(true);
      })();
    }, []),
  );

  const total = minutesInPeriod(perDay, period);
  const streak = readingStreak(perDay);
  const maxBookMinutes = perBook.reduce((m, b) => Math.max(m, b.minutes), 0);

  return (
    <Screen scroll>
      <Stack.Screen options={{ title: 'Statistika' }} />

      {loaded && perDay.length === 0 ? (
        <EmptyState
          title="Još nema podataka"
          hint="Pokreni tajmer ili dodaj sesiju čitanja da vidiš statistiku."
        />
      ) : (
        <>
          <View style={styles.periods}>
            {PERIOD_ORDER.map((p) => {
              const selected = period === p;
              return (
                <Pressable
                  key={p}
                  onPress={() => setPeriod(p)}
                  style={[
                    styles.chip,
                    {
                      borderColor: selected ? theme.accent : theme.line,
                      backgroundColor: selected ? theme.accent : 'transparent',
                    },
                  ]}>
                  <Text variant="label" color={selected ? theme.accentInk : theme.ink}>
                    {PERIOD_LABELS[p]}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.bigRow}>
            <Card style={styles.bigCard}>
              <Text variant="title" color={theme.accent}>
                {formatMinutes(total)}
              </Text>
              <Text variant="muted" style={{ marginTop: 4 }}>
                Ukupno ({PERIOD_LABELS[period].toLowerCase()})
              </Text>
            </Card>
            <Card style={styles.bigCard}>
              <Text variant="title" color={theme.accent}>
                {streak} 🔥
              </Text>
              <Text variant="muted" style={{ marginTop: 4 }}>
                Niz dana
              </Text>
            </Card>
          </View>

          <Text variant="heading" style={{ marginTop: 24, marginBottom: 8 }}>
            Po knjizi
          </Text>
          {perBook.length === 0 ? (
            <Text variant="muted">Nema zabilježenog vremena po knjizi.</Text>
          ) : (
            <View style={{ gap: 10 }}>
              {perBook.map((b) => (
                <Card key={b.title}>
                  <View style={styles.bookRow}>
                    <Text numberOfLines={1} style={{ flex: 1 }}>
                      {b.title}
                    </Text>
                    <Text variant="label" color={theme.accent}>
                      {formatMinutes(b.minutes)}
                    </Text>
                  </View>
                  <View
                    style={[styles.barTrack, { backgroundColor: theme.surfaceAlt }]}>
                    <View
                      style={[
                        styles.barFill,
                        {
                          backgroundColor: theme.accent,
                          width: `${maxBookMinutes ? (b.minutes / maxBookMinutes) * 100 : 0}%`,
                        },
                      ]}
                    />
                  </View>
                </Card>
              ))}
            </View>
          )}
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  periods: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginBottom: 16 },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
  },
  bigRow: { flexDirection: 'row', gap: 12 },
  bigCard: { flex: 1, alignItems: 'center', paddingVertical: 22 },
  bookRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  barTrack: { height: 6, borderRadius: 3, marginTop: 8, overflow: 'hidden' },
  barFill: { height: 6, borderRadius: 3 },
});
