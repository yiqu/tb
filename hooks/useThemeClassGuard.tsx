import { useEffect } from 'react';
import { useTheme } from 'next-themes';

/**
 * Watches for external className overwrites on <html> (e.g. React reconciliation
 * after a server action re-render) and re-applies the theme class that next-themes
 * manages via direct DOM manipulation.
 */


export default function useThemeClassGuard() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!resolvedTheme) return;

    const root = document.documentElement;

    const observer = new MutationObserver(() => {
      if (!root.classList.contains(resolvedTheme)) {
        root.classList.add(resolvedTheme);
      }
    });

    observer.observe(root, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, [resolvedTheme]);

  return null;
}
