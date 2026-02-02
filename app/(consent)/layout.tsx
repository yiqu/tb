/* eslint-disable better-tailwindcss/no-unnecessary-whitespace */
/* eslint-disable better-tailwindcss/enforce-consistent-line-wrapping */

import { Geist, Borel, Caveat, Geist_Mono, Lilita_One, Cherry_Bomb_One, Architects_Daughter } from 'next/font/google';

import { ThemeProvider } from '@/components/theme/ThemeProvider';

import type { Metadata } from 'next';

import './globals.css';
import './scrollbar.css';
import './tailwind-config.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  weight: '400',
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
    <html lang="en" suppressHydrationWarning>
      <body
        className={ `${geistSans.variable} ${geistMono.variable} ${caveat.variable} ${lilitaOne.variable} ${borel.variable} ${cherryBombOne.variable} ${architectsDaughter.variable} font-sans antialiased` }
        id="consent-root-layout"
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={ false } disableTransitionOnChange storageKey="app-theme-consent">
          { children }
        </ThemeProvider>
      </body>
    </html>
  );
}
