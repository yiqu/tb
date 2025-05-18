/* eslint-disable readable-tailwind/no-unnecessary-whitespace */
/* eslint-disable readable-tailwind/multiline */

import { Suspense } from 'react';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Geist, Borel, Caveat, Geist_Mono, Lilita_One, Cherry_Bomb_One } from 'next/font/google';

import ReactScan from '@/components/react-scan/ReactScan';
//import { geistFont, geistMonoFont } from '@/lib/fonts-config';
import CustomToaster from '@/components/toaster/CustomToaster';
import { ThemeProvider } from '@/components/theme/ThemeProvider';

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

export default function AdminRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-dvh!">
      <ReactScan />
      <body
        className={ `${cherryBombOne.variable} ${geistSans.variable} ${geistMono.variable} ${caveat.variable} ${lilitaOne.variable} ${borel.variable} h-full font-sans antialiased` }
      >
        <NuqsAdapter>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={ false }
            disableTransitionOnChange
            storageKey="app-theme"
            forcedTheme="dark"
          >
            <Suspense>{ children }</Suspense>
            <CustomToaster />
          </ThemeProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
