import { useTheme } from 'next-themes';

export default function useAppTheme() {
  const { setTheme, themes, resolvedTheme } = useTheme();

  const isDarkMode = resolvedTheme === 'dark';
  const isLightMode = resolvedTheme === 'light';

  return {
    isDarkMode,
    isLightMode,
    themes,
    setTheme,
  };
}
