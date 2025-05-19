/* eslint-disable readable-tailwind/no-unnecessary-whitespace */
/* eslint-disable readable-tailwind/multiline */

import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Geist, Borel, Caveat, Geist_Mono, Lilita_One, Cherry_Bomb_One, Architects_Daughter } from 'next/font/google';

import ReactScan from '@/components/react-scan/ReactScan';
//import { geistFont, geistMonoFont } from '@/lib/fonts-config';
import { ThemeProvider } from '@/components/theme/ThemeProvider';

import type { Metadata } from 'next';

import './scrollbar.css';
import './tailwind-config.css';
import './globals.css';

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

const architectsDaughter = Architects_Daughter({
  variable: '--font-architects-daughter',
  subsets: ['latin'],
  weight: '400',
  preload: true,
});

export const metadata: Metadata = {
  title: 'Education Budget',
  description: 'Education Budget',
};

export default function WelcomeRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-dvh!">
      <ReactScan />
      <body
        className={ `${cherryBombOne.variable} ${geistSans.variable} ${geistMono.variable} ${caveat.variable} ${lilitaOne.variable} ${borel.variable} ${architectsDaughter.variable} h-full font-sans antialiased` }
      >
        <NuqsAdapter>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={ false }
            disableTransitionOnChange
            storageKey="app-theme"
          >
            { children }
          </ThemeProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
