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

import { Suspense } from 'react';
import LayoutBody from './LayoutBody';

export const metadata: Metadata = {
  title: {
    template: `%s | ${appName}`, // child pages will use this template
    default: `Home | ${appName}`, // the title for this defined in
  },
  description: '',
};

export default async function BaseRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const [vibe, fontOverride] = await Promise.all([getSettingsApplicationVibe(), getSettingsApplicationFont()]);

  // const cssVariables = getFontVariableByVibe(vibe);
  // const fontOverrideCssVariables: string | undefined = getFontVariableByFont(fontOverride);

  return (
    <>
      <ReactScan />
      <Suspense>
        <LayoutBody>{ children }</LayoutBody>
      </Suspense>
    </>
  );
}
