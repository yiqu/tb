'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

/**
 * Watches for external className overwrites on <html> (e.g. React reconciliation
 * after a server action re-render) and re-applies the theme class that next-themes
 * manages via direct DOM manipulation.
 */
function ThemeClassGuard() {
  const { resolvedTheme } = useTheme();

  React.useEffect(() => {
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

export function ThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider { ...props }>
      <ThemeClassGuard />
      { children }
    </NextThemesProvider>
  );
}
