// path/to/ReactScanComponent

'use client';
// react-scan must be imported before react
import { scan } from 'react-scan';
import { JSX, useEffect } from 'react';

import useIsClient from '@/hooks/useIsClient';

export function ReactScan(): JSX.Element {
  const isClient = useIsClient();

  useEffect(() => {
    if (isClient) {
      scan({
        enabled: process.env.NODE_ENV === 'development',
      });
    }
  }, [isClient]);

  return <></>;
}
