'use client';

import { ReactNode } from 'react';
import { CookiesNextProvider } from 'cookies-next';

interface ProvidersProps {
  children: ReactNode;
}

export default function NextCookiesProvider({ children }: ProvidersProps) {
  return <CookiesNextProvider>{ children }</CookiesNextProvider>;
}
