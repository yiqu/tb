'use client';

import { RotateCcw } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button, ButtonProps } from '@/components/ui/button';
import useDashboardRangeSelect from '@/hooks/useDashboardRangeSelect';

export default function BillsActionBarClearAllFilters({ className, ...props }: { className?: string } & ButtonProps) {
  const { clearParams } = useDashboardRangeSelect();

  const handleClearAllFilters = () => {
    clearParams();
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={ handleClearAllFilters }
      className={ cn(`
        bg-yellow-500/20
        dark:bg-yellow-500/50
      `, className) }
      { ...props }
    >
      <RotateCcw className="size-4" />
      Clear filters
    </Button>
  );
}
