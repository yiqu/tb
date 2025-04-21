'use client';

import { createTheme } from '@mui/material/styles';

import { geistFont } from '@/lib/fonts-config';

const theme = createTheme({
  // The colorSchemes property configures the theme's color schemes
  // When set to { light: true, dark: true }, it enables both light and dark modes
  // This allows the theme to adapt based on the user's preference or system setting
  // Each scheme can also be customized with specific palette options instead of boolean values
  colorSchemes: { light: true, dark: true },
  cssVariables: {
    colorSchemeSelector: 'data-mui-color-scheme',
  },
  typography: {
    fontFamily: geistFont.style.fontFamily,
  },

  // MUI Components overrides
  components: {
    // ... overrides
  },
});

export default theme;
