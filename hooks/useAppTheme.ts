import { useTheme } from 'next-themes';

export default function useAppTheme() {
  const { theme, setTheme, themes } = useTheme();

  const isDarkMode = theme === 'dark';
  const isLightMode = theme === 'light';

  return {
    isDarkMode,
    isLightMode,
    themes,
    setTheme,
  };
}
