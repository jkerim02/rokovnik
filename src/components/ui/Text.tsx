/** Themed Text — tipografski varijanti vezani za temu. */
import { Text as RNText, type TextProps, type TextStyle } from 'react-native';

import { useTheme } from '@/theme';

type Variant = 'title' | 'heading' | 'body' | 'label' | 'muted';

const sizes: Record<Variant, TextStyle> = {
  title: { fontSize: 26, fontWeight: '700' },
  heading: { fontSize: 18, fontWeight: '600' },
  body: { fontSize: 15, fontWeight: '400' },
  label: { fontSize: 13, fontWeight: '600' },
  muted: { fontSize: 13, fontWeight: '400' },
};

type Props = TextProps & { variant?: Variant; color?: string };

export function Text({ variant = 'body', color, style, ...rest }: Props) {
  const { theme } = useTheme();
  const resolved = color ?? (variant === 'muted' ? theme.muted : theme.ink);
  return <RNText {...rest} style={[sizes[variant], { color: resolved }, style]} />;
}
