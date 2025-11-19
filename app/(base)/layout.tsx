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

export default function BaseRootLayout({ children }: LayoutProps<'/'>) {
  return (
    <>
      <ReactScan />
      <Suspense>
        <LayoutBody>{ children }</LayoutBody>
      </Suspense>
    </>
  );
}
