'use client';

import useSyncMuiThemeWithNextThemes from '@/hooks/useSyncMuiTheme';

/**
 * Keeps MUI's color scheme in step with next-themes in the base app, so MUI components
 * (pagination, inputs) never render with dark mode colors on a light page, or the reverse.
 *
 * Mount it only under both MUI's ThemeProvider and next-themes' ThemeProvider, with both using
 * APP_THEME_STORAGE_KEY (see BodyParent).
 */
export default function MuiThemeSync() {
  useSyncMuiThemeWithNextThemes();
  return null;
}
