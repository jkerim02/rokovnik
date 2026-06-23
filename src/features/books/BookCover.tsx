/** BookCover — prikaz naslovnice ili placeholder sa inicijalom naslova. */
import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';
import { useTheme } from '@/theme';

type Props = {
  uri?: string | null;
  title?: string | null;
  size?: number;
};

export function BookCover({ uri, title, size = 56 }: Props) {
  const { theme } = useTheme();
  const dims = { width: size, height: size * 1.4, borderRadius: 6 };

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={dims}
        contentFit="cover"
        transition={120}
      />
    );
  }

  return (
    <View
      style={[
        dims,
        styles.placeholder,
        { backgroundColor: theme.surfaceAlt, borderColor: theme.line },
      ]}>
      <Text variant="heading" color={theme.muted}>
        {title?.trim()?.charAt(0)?.toUpperCase() ?? '?'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
});
