/* eslint-disable readable-tailwind/no-unnecessary-whitespace */
/* eslint-disable readable-tailwind/multiline */
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

import { Suspense } from 'react';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Geist, Borel, Caveat, Geist_Mono, Lilita_One, Cherry_Bomb_One } from 'next/font/google';

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
    <TooltipProvider delayDuration={ 0 }>
      <Suspense>
        <AppLayout>{ children }</AppLayout>
      </Suspense>
      <CustomToaster />
    </TooltipProvider>
  );
}
