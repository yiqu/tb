import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

import { Suspense } from 'react';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Geist, Caveat, Geist_Mono } from 'next/font/google';
import { unstable_ViewTransition as ViewTransition } from 'react';

import theme from '@/components/ui-mui/mui/theme';
import AppLayout from '@/components/layout/AppLayout';
import ReactScan from '@/components/react-scan/ReactScan';
import { TooltipProvider } from '@/components/ui/tooltip';
//import { geistFont, geistMonoFont } from '@/lib/fonts-config';
import CustomToaster from '@/components/toaster/CustomToaster';
import AppTopLoader from '@/components/top-loader/AppTopLoader';
import AgGridRegister from '@/components/ag-grid/AgGridRegister';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import TanstackQueryClientProvider from '@/providers/TanstackQueryClientProvider';

import type { Metadata } from 'next';

import './globals.css';
import './scrollbar.css';
import './tailwind-config.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const caveat = Caveat({
  variable: '--font-caveat',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Education Budget',
  description: 'Education Budget',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <ViewTransition>
        <ReactScan />
        <body className={ `
          ${geistSans.variable}
          ${geistMono.variable}
          ${caveat.variable}
          font-sans antialiased
        ` }>
          <AgGridRegister />
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
                    { /* <CssBaseline /> */ }
                    <TooltipProvider delayDuration={ 0 }>
                      <Suspense>
                        <AppLayout>{ children }</AppLayout>
                      </Suspense>
                      <CustomToaster />
                    </TooltipProvider>
                  </ThemeProvider>
                </TanstackQueryClientProvider>
              </NuqsAdapter>
            </MuiThemeProvider>
          </AppRouterCacheProvider>
        </body>
      </ViewTransition>
    </html>
  );
}
