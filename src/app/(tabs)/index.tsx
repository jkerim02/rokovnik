import { Stack } from 'expo-router';

import { EmptyState, Screen } from '@/components/ui';

export default function BibliotekaScreen() {
  return (
    <Screen>
      <Stack.Screen options={{ title: 'Biblioteka' }} />
      <EmptyState
        title="Biblioteka"
        hint="Lista knjiga dolazi u sljedećem koraku."
      />
    </Screen>
  );
}
