/* eslint-disable perfectionist/sort-imports */
/* eslint-disable better-tailwindcss/no-unnecessary-whitespace */
/* eslint-disable better-tailwindcss/enforce-consistent-line-wrapping */
import ReactScan from '@/providers/ReactScan';

import { appName } from '@/constants/constants';
import type { Metadata } from 'next';

import './globals.css';
import './scrollbar.css';
import './tailwind-config.css';
import './animations.css';

import BodyParent from './BodyParent';
import { getSettingsApplicationFont, getSettingsApplicationVibe } from '@/server/settings/vibe-select';
import { getFontVariableByFont, getFontVariableByVibe } from '@/lib/vibes-css-map';
import { cn } from '@/lib/utils';
import { Cherry_Bomb_One } from 'next/font/google';

const cherryBombOne = Cherry_Bomb_One({
  variable: '--font-cherry-bomb-one',
  subsets: ['latin'],
  weight: ['400'],
  preload: false,
});

export const metadata: Metadata = {
  title: {
    template: `%s | ${appName}`, // child pages will use this template
    default: `Home | ${appName}`, // the title for this defined in
  },
  description: '',
};

export const experimental_ppr = true;

export default async function BaseRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [vibe, fontOverride] = await Promise.all([getSettingsApplicationVibe(), getSettingsApplicationFont()]);

  const cssVariables = getFontVariableByVibe(vibe);
  const fontOverrideCssVariables: string | undefined = getFontVariableByFont(fontOverride);

  return (
    <html
      lang="en"
      className={ cn(fontOverrideCssVariables ? `${fontOverrideCssVariables} ${cherryBombOne.variable}` : cssVariables) }
      suppressHydrationWarning
    >
      <ReactScan />
      <BodyParent>{ children }</BodyParent>
    </html>
  );
}
