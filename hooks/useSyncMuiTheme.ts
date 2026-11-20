import { useColorScheme } from '@mui/material/styles';

import { useEffect } from 'react';
import { useTheme, UseThemeProps } from 'next-themes';

/**
 * Keeps MUI's color scheme mode in sync with next-themes.
 *
 * Uses the chosen theme (light, dark or system), not the resolved one. MUI and next-themes share
 * the same storage key, so writing the resolved value would overwrite a "system" choice.
 */
export default function useSyncMuiThemeWithNextThemes() {
  const { theme }: UseThemeProps = useTheme();
  const { mode, setMode } = useColorScheme();

  useEffect(() => {
    if ((theme === 'light' || theme === 'dark' || theme === 'system') && theme !== mode) {
      setMode(theme);
    }
  }, [theme, mode, setMode]);
}
