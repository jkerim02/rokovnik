import { StyleSheet, View } from 'react-native';

import { Card, Screen, Text } from '@/components/ui';
import { useTheme, type ThemeOverride } from '@/theme';

const OPTIONS: { label: string; value: ThemeOverride }[] = [
  { label: 'Sistemski', value: null },
  { label: 'Svijetla', value: 'light' },
  { label: 'Tamna', value: 'dark' },
];

export default function SettingsScreen() {
  const { theme, override, setOverride } = useTheme();

  return (
    <Screen scroll>
      <Text variant="label" color={theme.muted} style={styles.section}>
        TEMA
      </Text>
      <Card>
        {OPTIONS.map((opt, i) => {
          const selected = override === opt.value;
          return (
            <View
              key={opt.label}
              style={[
                styles.row,
                i > 0 && { borderTopColor: theme.line, borderTopWidth: StyleSheet.hairlineWidth },
              ]}>
              <Text>{opt.label}</Text>
              <Text
                onPress={() => setOverride(opt.value)}
                color={selected ? theme.accent : theme.muted}
                variant="label">
                {selected ? '● odabrano' : 'odaberi'}
              </Text>
            </View>
          );
        })}
      </Card>

      <Text variant="label" color={theme.muted} style={styles.section}>
        NALOG / SYNC
      </Text>
      <Card>
        <Text>Offline način</Text>
        <Text variant="muted" style={{ marginTop: 4 }}>
          Sve je sačuvano lokalno na ovom uređaju. Prijava i sinhronizacija
          dolaze u kasnijoj verziji.
        </Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: { marginTop: 20, marginBottom: 8, letterSpacing: 1 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
});
