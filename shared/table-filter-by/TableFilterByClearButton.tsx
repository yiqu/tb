'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export interface TableFilterByClearButtonProps {
  onClear: () => void;
  children?: React.ReactNode;
  className?: string;
}

/**
 * Drops the column's filter from inside the "Filter By" panel.
 *
 * Stops `pointerdown` and `keydown` from bubbling for the same reason the input and Apply do — the
 * dropdown closes on a click it reads as a menu item, and Space on a focused button is menu
 * type-ahead to it.
 */
export default function TableFilterByClearButton({ onClear, children, className }: TableFilterByClearButtonProps) {
  const handleOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onClear();
  };

  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      onClick={ handleOnClick }
      onPointerDown={ (e) => e.stopPropagation() }
      onKeyDown={ (e) => e.stopPropagation() }
      className={ cn('w-full', className) }
    >
      { children ?? 'Clear' }
    </Button>
  );
}
