import { Tabs } from 'expo-router';
import { Text, type ColorValue } from 'react-native';

import { useTheme } from '@/theme';

function TabIcon({ icon, color }: { icon: string; color: ColorValue }) {
  return <Text style={{ fontSize: 20, color }}>{icon}</Text>;
}

export default function TabsLayout() {
  const { theme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: theme.surface },
        headerTintColor: theme.ink,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopColor: theme.line,
        },
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.muted,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Biblioteka',
          tabBarIcon: ({ color }) => <TabIcon icon="📚" color={color} />,
        }}
      />
      <Tabs.Screen
        name="rjecnik"
        options={{
          title: 'Rječnik',
          tabBarIcon: ({ color }) => <TabIcon icon="🔤" color={color} />,
        }}
      />
      <Tabs.Screen
        name="vokabular"
        options={{
          title: 'Vokabular',
          tabBarIcon: ({ color }) => <TabIcon icon="🗂️" color={color} />,
        }}
      />
      <Tabs.Screen
        name="ucenje"
        options={{
          title: 'Učenje',
          tabBarIcon: ({ color }) => <TabIcon icon="🎯" color={color} />,
        }}
      />
    </Tabs>
  );
}
