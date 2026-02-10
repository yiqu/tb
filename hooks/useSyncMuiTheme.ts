import { useColorScheme } from '@mui/material/styles';

import { useEffect } from 'react';
import { useTheme, UseThemeProps } from 'next-themes';

export default function useSyncMuiThemeWithNextThemes() {
  const { resolvedTheme }: UseThemeProps = useTheme();
  const { setMode } = useColorScheme();

  // Keep MUI color scheme in sync with next-themes resolved value
  useEffect(() => {
    if (resolvedTheme === 'light' || resolvedTheme === 'dark') {
      setMode(resolvedTheme);
    }
  }, [resolvedTheme, setMode]);
}
