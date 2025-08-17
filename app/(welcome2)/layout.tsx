/* eslint-disable perfectionist/sort-imports */
/* eslint-disable better-tailwindcss/no-unnecessary-whitespace */
/* eslint-disable better-tailwindcss/enforce-consistent-line-wrapping */

import type { Metadata } from 'next';

import './globals.css';
import './tailwind-config.css';
import './animations.css';

import { geistMono, geistSans } from '@/lib/vibes-css-map';
import { ThemeProvider } from '@/components/theme/ThemeProvider';

export const metadata: Metadata = {
  title: 'Welcome | KQPRO',
  description: 'Welcome to KQPRO',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={ ` ${geistSans.variable} ${geistMono.variable} ` }>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={ false } disableTransitionOnChange storageKey="welcome-page-theme">
          { children }
        </ThemeProvider>
      </body>
    </html>
  );
}
