import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Text } from '@/components/ui';
import { useDbMigrations } from '@/db/migrate';
import { settingsRepo } from '@/db/repositories';
import { ThemeProvider, type ThemeOverride } from '@/theme';

export default function RootLayout() {
  const { success, error } = useDbMigrations();
  const [override, setOverride] = useState<ThemeOverride>(null);
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  // Učitaj perzistirani theme_override tek kad su migracije gotove.
  useEffect(() => {
    if (!success) return;
    settingsRepo
      .getSettings()
      .then((s) => setOverride((s.themeOverride as ThemeOverride) ?? null))
      .finally(() => setSettingsLoaded(true));
  }, [success]);

  if (error) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <Text variant="heading">Greška pri inicijalizaciji baze</Text>
        <Text variant="muted" style={{ marginTop: 8 }}>
          {error.message}
        </Text>
      </View>
    );
  }

  if (!success || !settingsLoaded) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider
          initialOverride={override}
          onOverrideChange={(next) => {
            void settingsRepo.setThemeOverride(next);
          }}>
          <StatusBar style="auto" />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="book/[id]" options={{ headerShown: true, title: 'Knjiga' }} />
            <Stack.Screen
              name="settings"
              options={{ headerShown: true, title: 'Podešavanja', presentation: 'modal' }}
            />
          </Stack>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
