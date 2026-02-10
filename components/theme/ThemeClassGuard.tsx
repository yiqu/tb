import useThemeClassGuard from '@/hooks/useThemeClassGuard';

/**
 * Watches for external className overwrites on <html> (e.g. React reconciliation
 * after a server action re-render) and re-applies the theme class that next-themes
 * manages via direct DOM manipulation.
 */

export default function ThemeClassGuard() {
  useThemeClassGuard();
  return null;
}
