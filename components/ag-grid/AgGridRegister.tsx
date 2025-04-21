/* eslint-disable no-console */
'use client';

import { useEffect } from 'react';
import { ModuleRegistry } from 'ag-grid-community';
import { AllCommunityModule } from 'ag-grid-community';

export default function AgGridRegister() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      ModuleRegistry.registerModules([AllCommunityModule]);
      console.log('AGGrid Registered');
    }
  }, []);
  return null;
}
