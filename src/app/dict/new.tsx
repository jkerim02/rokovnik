import { Stack, router } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

import { Button, Field, Screen } from '@/components/ui';
import { dictRepo } from '@/db/repositories';

const MANUAL_DICT = 'Moje odrednice';

export default function NewDictEntryScreen() {
  const [term, setTerm] = useState('');
  const [definition, setDefinition] = useState('');
  const [pos, setPos] = useState('');
  const [exampleTerm, setExampleTerm] = useState('');
  const [exampleDefinition, setExampleDefinition] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!term.trim() || !definition.trim()) {
      Alert.alert('Pojam i definicija su obavezni');
      return;
    }
    setSaving(true);
    try {
      const dict = await dictRepo.ensureDictionary(MANUAL_DICT);
      await dictRepo.createDictEntry({
        dictionaryId: dict.id,
        term: term.trim(),
        definition: definition.trim(),
        pos: pos.trim() || null,
        exampleTerm: exampleTerm.trim() || null,
        exampleDefinition: exampleDefinition.trim() || null,
      });
      router.back();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen scroll>
      <Stack.Screen options={{ title: 'Nova odrednica' }} />
      <Field label="Pojam *" value={term} onChangeText={setTerm} />
      <Field
        label="Definicija *"
        value={definition}
        onChangeText={setDefinition}
        multiline
        numberOfLines={3}
        style={{ minHeight: 70, textAlignVertical: 'top' }}
      />
      <Field label="Vrsta riječi (pos)" value={pos} onChangeText={setPos} />
      <Field label="Primjer (pojam)" value={exampleTerm} onChangeText={setExampleTerm} />
      <Field
        label="Primjer (prijevod)"
        value={exampleDefinition}
        onChangeText={setExampleDefinition}
      />
      <Button title="Sačuvaj odrednicu" onPress={handleSave} loading={saving} />
    </Screen>
  );
}
