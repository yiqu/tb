/* eslint-disable better-tailwindcss/no-unnecessary-whitespace */
/* eslint-disable better-tailwindcss/enforce-consistent-line-wrapping */
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

import { Suspense } from 'react';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Geist, Borel, Caveat, Geist_Mono, Lilita_One, Cherry_Bomb_One } from 'next/font/google';

import theme from '@/components/ui-mui/mui/theme';
import CustomToaster from '@/components/toaster/CustomToaster';
import AppTopLoader from '@/components/top-loader/AppTopLoader';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import TanstackQueryClientProvider from '@/providers/TanstackQueryClientProvider';

import type { Metadata } from 'next';

import './login-globals.css';
import './tailwind-config.css';

export const metadata: Metadata = {
  title: 'Education Budget',
  description: 'Education Budget',
};

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  preload: true,
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  preload: true,
});

const caveat = Caveat({
  variable: '--font-caveat',
  subsets: ['latin'],
});

const lilitaOne = Lilita_One({
  variable: '--font-lilita-one',
  subsets: ['latin'],
  weight: '400',
});

const borel = Borel({
  variable: '--font-borel',
  subsets: ['latin'],
  weight: '400',
});

const cherryBombOne = Cherry_Bomb_One({
  variable: '--font-cherry-bomb-one',
  subsets: ['latin'],
  weight: '400',
  preload: true,
});

export default function LoginRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={ `${geistSans.variable} ${geistMono.variable} ${caveat.variable} ${lilitaOne.variable} ${borel.variable} ${cherryBombOne.variable} font-sans antialiased` }
        id="login-root-layout"
      >
        <AppTopLoader />
        <InitColorSchemeScript defaultMode="light" attribute="data-mui-color-scheme" />
        <AppRouterCacheProvider options={ { enableCssLayer: true } }>
          <MuiThemeProvider theme={ theme } defaultMode="light">
            <NuqsAdapter>
              <TanstackQueryClientProvider>
                <ThemeProvider attribute="class" defaultTheme="light" enableSystem={ false } disableTransitionOnChange storageKey="app-theme">
                  <div className="h-dvh!" id="login-root">
                    <Suspense>{ children }</Suspense>
                    <CustomToaster />
                  </div>
                </ThemeProvider>
              </TanstackQueryClientProvider>
            </NuqsAdapter>
          </MuiThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
