/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

// @ts-nocheck
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function useTheme() {
  const scheme = useColorScheme();
  const resolvedTheme: keyof typeof Colors = scheme === 'dark' ? 'dark' : 'light';

  return Colors[resolvedTheme];
}
