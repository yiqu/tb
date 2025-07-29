'use client';

import { scan } from 'react-scan';
import { ReactNode, useEffect } from 'react';

export default function ReactScan(): ReactNode {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      scan({
        enabled: process.env.NODE_ENV === 'development',
      });
    }
  }, []);

  return <></>;
}
