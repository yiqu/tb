'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export interface TableFilterByApplyButtonProps {
  onApply: () => void;
  /** The draft differs from the applied filter. A clean draft leaves the button disabled. */
  isDirty: boolean;
  children?: React.ReactNode;
  className?: string;
}

/**
 * Commits the filter input to the search params.
 *
 * Stops `pointerdown` and `keydown` from bubbling for the same reason the input does — the dropdown
 * closes on a click it thinks is a menu item, and Space on a focused button is menu type-ahead to it.
 */
export default function TableFilterByApplyButton({ onApply, isDirty, children, className }: TableFilterByApplyButtonProps) {
  const handleOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onApply();
  };

  return (
    <Button
      type="button"
      size="sm"
      disabled={ !isDirty }
      onClick={ handleOnClick }
      onPointerDown={ (e) => e.stopPropagation() }
      onKeyDown={ (e) => e.stopPropagation() }
      className={ cn('w-full', className) }
    >
      { children ?? 'Apply' }
    </Button>
  );
}
