'use client';

import { ReactNode } from 'react';
import { X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface InputWithMultiSelectClearButtonProps {
  /** Called on click. The parent clears the text and decides what else a clear means. */
  onClear: () => void;
  disabled?: boolean;
  /** Icon to render. Defaults to lucide's `X`. */
  icon?: ReactNode;
  /** Accessible label of the button. */
  label?: string;
  className?: string;
}

/**
 * Clears the text of `InputWithMultiSelect`. Rendered inside the input, to the left of the submit
 * trigger, and only while there is something to clear. `type="button"` so it never submits a
 * surrounding form.
 */
export default function InputWithMultiSelectClearButton({
  onClear,
  disabled,
  icon,
  label = 'Clear',
  className,
}: InputWithMultiSelectClearButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={ label }
      title={ label }
      disabled={ disabled }
      onClick={ onClear }
      className={ cn(
        `
          size-7 text-muted-foreground
          hover:bg-accent hover:text-foreground
        `,
        className,
      ) }
    >
      { icon ?? <X className="size-4" /> }
    </Button>
  );
}
