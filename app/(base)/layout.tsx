/* eslint-disable perfectionist/sort-imports */
/* eslint-disable better-tailwindcss/no-unnecessary-whitespace */
/* eslint-disable better-tailwindcss/multiline */
import ReactScan from '@/providers/ReactScan';

import { appName } from '@/constants/constants';
import type { Metadata } from 'next';

import './globals.css';
import './scrollbar.css';
import './tailwind-config.css';

import BodyParent from './BodyParent';
import { getSettingsApplicationVibe } from '@/server/settings/vibe-select';
import { getFontVariableByVibe } from '@/lib/vibes-css-map';

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
  const vibe = await getSettingsApplicationVibe();
  const cssVariables = getFontVariableByVibe(vibe);

  return (
    <html lang="en" className={ cssVariables } suppressHydrationWarning>
      <ReactScan />
      <BodyParent>{ children }</BodyParent>
    </html>
  );
}
