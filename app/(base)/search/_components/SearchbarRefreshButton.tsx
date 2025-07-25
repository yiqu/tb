'use client';

import { RefreshCcw } from 'lucide-react';

import { Button } from '@/components/ui/button';

export default function SearchbarRefreshButton() {
  return (
    <Button variant="outline" size="default" className="bg-card">
      <RefreshCcw />
      Refresh
    </Button>
  );
}
