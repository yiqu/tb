/* eslint-disable better-tailwindcss/no-unnecessary-whitespace */
/* eslint-disable better-tailwindcss/multiline */
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

import { Suspense } from 'react';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Geist, Outfit, Merriweather, JetBrains_Mono, Cherry_Bomb_One } from 'next/font/google';

import theme from '@/components/ui-mui/mui/theme';
import AppLayout from '@/components/layout/AppLayout';
import ReactScan from '@/components/react-scan/ReactScan';
import CustomToaster from '@/components/toaster/CustomToaster';
import AppTopLoader from '@/components/top-loader/AppTopLoader';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import TanstackQueryClientProvider from '@/providers/TanstackQueryClientProvider';

import type { Metadata } from 'next';

import './globals.css';
import './scrollbar.css';
import './tailwind-config.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  preload: true,
});

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
  preload: true,
});

const merriweather = Merriweather({
  variable: '--font-merriweather',
  subsets: ['latin'],
  weight: '400',
  preload: true,
});

const jetBrainsMono = JetBrains_Mono({
  variable: '--font-jet-brains-mono',
  subsets: ['latin'],
  preload: true,
});

const cherryBombOne = Cherry_Bomb_One({
  variable: '--font-cherry-bomb-one',
  subsets: ['latin'],
  weight: '400',
});

export const metadata: Metadata = {
  title: 'Education Budget',
  description: 'Education Budget',
};

export default function AdminRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <ReactScan />
      <body
        className={ `${outfit.variable} ${merriweather.variable} ${jetBrainsMono.variable} ${cherryBombOne.variable} ${geistSans.variable} font-sans antialiased` }
        id="admin-root-layout"
      >
        <AppTopLoader />
        <InitColorSchemeScript defaultMode="light" attribute="data-mui-color-scheme" />
        <AppRouterCacheProvider options={ { enableCssLayer: true } }>
          <MuiThemeProvider theme={ theme } defaultMode="light">
            <NuqsAdapter>
              <TanstackQueryClientProvider>
                <ThemeProvider
                  attribute="class"
                  defaultTheme="light"
                  enableSystem={ false }
                  disableTransitionOnChange
                  storageKey="app-theme"
                >
                  <Suspense>
                    <AppLayout>{ children }</AppLayout>
                  </Suspense>
                  <CustomToaster />
                </ThemeProvider>
              </TanstackQueryClientProvider>
            </NuqsAdapter>
          </MuiThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
