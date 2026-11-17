import { Suspense } from 'react';

import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';

import { ThemeProvider } from '@/components/theme/ThemeProvider';

import { appName, TABLE_BORDER_DATA_ATTRIBUTES } from '@/constants/constants';
import InlineScript from '@/components/inline-script/InlineScript';
import AppShellSkeleton from '@/components/layout/AppShellSkeleton';
import { getBodyBootScript, getHeadBootScript } from '@/lib/settings-boot-script';

import type { Metadata } from 'next';

import './globals.css';
import './scrollbar.css';
import './animations.css';
import './tailwind-config.css';
import BodyParent from './BodyParent';

export const metadata: Metadata = {
  title: {
    template: `%s | ${appName}`, // child pages will use this template
    default: `Home | ${appName}`, // the title for this defined in
  },
  description: '',
};

/**
 * The (base) root layout renders no request data, so `<html>`, `<head>`, `<body>` and the
 * app shell skeleton are prerendered into the static shell. Cookie-based settings are applied
 * before the first paint by the boot scripts, and the cookie-dependent chrome (sidebar, top nav,
 * settings providers) streams into the Suspense boundary.
 */
export default function BaseRootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        { /* writes the vibe and font stylesheets for the saved settings before the first paint */ }
        <InlineScript html={ getHeadBootScript() } />
      </head>
      <body
        id="base-root-layout"
        className="font-sans antialiased"
        suppressHydrationWarning
        { ...{
          [TABLE_BORDER_DATA_ATTRIBUTES.horizontal]: 'true',
          [TABLE_BORDER_DATA_ATTRIBUTES.vertical]: 'true',
        } }
      >
        <InlineScript html={ getBodyBootScript() } />
        { /* MUI color scheme script — must execute before React hydration to avoid flash of unstyled content */ }
        <InitColorSchemeScript defaultMode="system" attribute="data-mui-color-scheme" />
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange storageKey="app-theme">
          <Suspense fallback={ <AppShellSkeleton /> }>
            <BodyParent>{ children }</BodyParent>
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
