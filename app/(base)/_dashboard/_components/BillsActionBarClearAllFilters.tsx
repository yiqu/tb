'use client';

import { RotateCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { cn } from '@/lib/utils';
import { Button, ButtonProps } from '@/components/ui/button';

export default function BillsActionBarClearAllFilters({ className, ...props }: { className?: string } & ButtonProps) {
  const router = useRouter();

  const handleClearAllFilters = () => {
    router.push('/');
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
      Go back to current month
    </Button>
  );
}
