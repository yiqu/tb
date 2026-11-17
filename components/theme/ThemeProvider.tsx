'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

import ThemeClassGuard from './ThemeClassGuard';

export function ThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider { ...props }>
      <ThemeClassGuard />
      { children }
    </NextThemesProvider>
  );
}

