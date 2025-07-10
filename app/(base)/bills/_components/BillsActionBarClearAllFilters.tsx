'use client';

import { X } from 'lucide-react';
import { useRouter, useSearchParams, ReadonlyURLSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';

export default function BillsActionBarClearAllFilters() {
  const searchParams: ReadonlyURLSearchParams = useSearchParams();
  const router = useRouter();
  const hasFilters: boolean = searchParams.toString() !== '';

  const handleClearAllFilters = () => {
    router.push('/bills');
  };

  if (!hasFilters) {
    return null;
  }

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
