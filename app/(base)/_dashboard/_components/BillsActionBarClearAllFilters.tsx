'use client';

import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

export default function BillsActionBarClearAllFilters() {
  const router = useRouter();

  const handleClearAllFilters = () => {
    router.push('/');
  };

  return (
    <Button variant="outline" size="sm" onClick={ handleClearAllFilters } className={ `
      bg-yellow-500/20
      dark:bg-yellow-500/50
    ` }>
      <X className="size-4" />
      Clear filters
    </Button>
  );
}
