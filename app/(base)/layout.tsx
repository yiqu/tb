import { Suspense } from 'react';

import { appName } from '@/constants/constants';

import type { Metadata } from 'next';

import './tailwind-config.css';
import './globals.css';
import './scrollbar.css';
import './animations.css';
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
      <Suspense>
        <LayoutBody>{ children }</LayoutBody>
      </Suspense>
    </>
  );
}
