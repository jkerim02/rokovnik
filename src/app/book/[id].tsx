import { useLocalSearchParams } from 'expo-router';

import { EmptyState, Screen } from '@/components/ui';

export default function BookDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <Screen>
      <EmptyState
        title="Detalj knjige"
        hint={`Detalji, bilješke i sesije za knjigu ${id} dolaze uskoro.`}
      />
    </Screen>
  );
}
