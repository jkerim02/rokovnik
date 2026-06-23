/**
 * TimerIndicator — plutajući indikator aktivne sesije (§3), vidljiv na svim
 * ekranima. Prikazuje proteklo vrijeme + naslov, sa brzim stop dugmetom.
 */
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/ui';
import { useTimerStore } from '@/state/timerStore';
import { formatElapsed } from '@/state/timerStore';
import { useTheme } from '@/theme';
import { stopActiveTimer } from './stopTimer';
import { useElapsed } from './useElapsed';

export function TimerIndicator() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const active = useTimerStore((s) => s.active);
  const seconds = useElapsed(active?.startTime);

  if (!active) return null;

  return (
    <View
      pointerEvents="box-none"
      style={[styles.wrap, { bottom: insets.bottom + 70 }]}>
      <View style={[styles.pill, { backgroundColor: theme.accent }]}>
        <Text color={theme.accentInk}>⏱ {formatElapsed(seconds)}</Text>
        <Text color={theme.accentInk} numberOfLines={1} style={styles.title}>
          · {active.bookTitle}
        </Text>
        <TouchableOpacity
          onPress={() => void stopActiveTimer()}
          hitSlop={10}
          style={styles.stop}>
          <Text color={theme.accentInk} variant="label">
            ■ Stop
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 22,
    maxWidth: '92%',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  title: { flexShrink: 1 },
  stop: { marginLeft: 8 },
});
