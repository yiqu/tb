'use client';

import { useEffect } from 'react';

import { triggerPasswordIncorrect } from '@/server/admin/admin.server';

export default function AdminPanelReset() {
  useEffect(() => {
    triggerPasswordIncorrect();
  }, []);

  return <></>;
}
