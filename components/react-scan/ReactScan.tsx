// path/to/ReactScanComponent

'use client';
// react-scan must be imported before react
import { scan } from 'react-scan';
import { ReactNode, useEffect } from 'react';

import useIsClient from '@/hooks/useIsClient';

export default function ReactScan(): ReactNode {
  const isClient = useIsClient();

  useEffect(() => {
    if (!isClient) return;

    if (process.env.NODE_ENV === 'development') {
      scan({
        enabled: true,
      });
    }
  }, [isClient]);

  return null;
}
