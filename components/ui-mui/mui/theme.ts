'use client';

import { createTheme } from '@mui/material/styles';

// Extend MUI's breakpoint interface to include custom breakpoints
/**
 * Defaults:
 *    xs: 0,
 *    // small
 *    sm: 600,
 *    // medium
 *    md: 900,
 */
declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    mobile: true;
    xxl: true;
    xxs: true;
  }
}

const theme = createTheme({
  // The colorSchemes property configures the theme's color schemes
  // When set to { light: true, dark: true }, it enables both light and dark modes
  // This allows the theme to adapt based on the user's preference or system setting
  // Each scheme can also be customized with specific palette options instead of boolean values
  colorSchemes: { light: true, dark: true },
  cssVariables: {
    colorSchemeSelector: 'data-mui-color-scheme',
  },
  typography: {},

  // MUI Components overrides
  components: {
    // ... overrides
  },

  breakpoints: {
    values: {
      mobile: 0,
      xxs: 600,
      xs: 750,
      sm: 1300,
      md: 1920,
      lg: 2300,
      xl: 2560,
      xxl: 3200, // custom breakpoint
    },
  },
});

export default theme;
