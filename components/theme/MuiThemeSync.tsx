import useSyncMuiThemeWithNextThemes from '@/hooks/useSyncMuiTheme';

/**
 * Keeps MUI's color scheme in step with next-themes on every page, so MUI components
 * (pagination, inputs) never render with dark mode colors on a light page, or the reverse.
 */
export default function MuiThemeSync() {
  useSyncMuiThemeWithNextThemes();
  return null;
}
