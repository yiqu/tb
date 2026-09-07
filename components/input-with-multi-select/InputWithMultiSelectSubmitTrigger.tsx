'use client';

import { ReactNode } from 'react';
import { Search } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface InputWithMultiSelectSubmitTriggerProps {
  /** Called on click. The parent decides what "submitting" means. */
  onSubmit: () => void;
  disabled?: boolean;
  /** Icon to render. Defaults to lucide's `Search`. */
  icon?: ReactNode;
  /** Accessible label of the button. */
  label?: string;
  className?: string;
}

/**
 * Right hand side of `InputWithMultiSelect`: an icon button living inside the input that
 * submits the current value manually. Positioning is the parent's job — it lays this out next to
 * the clear button. `type="button"` so it never submits a surrounding form.
 */
export default function InputWithMultiSelectSubmitTrigger({
  onSubmit,
  disabled,
  icon,
  label = 'Submit',
  className,
}: InputWithMultiSelectSubmitTriggerProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={ label }
      title={ label }
      disabled={ disabled }
      onClick={ onSubmit }
      className={ cn(
        `
          size-7 text-muted-foreground
          hover:bg-accent hover:text-foreground
        `,
        className,
      ) }
    >
      { icon ?? <Search className="size-4" /> }
    </Button>
  );
}
