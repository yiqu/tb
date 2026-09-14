'use client';

import { cn } from '@/lib/utils';
import { useFormField } from '@/components/ui/form';

import { resolveInputWithMultiSelectErrorMessage } from './hf-input-with-multi-select.utils';

/**
 * Stand-in for shadcn's `FormMessage` that also surfaces errors reported on the nested
 * `input` / `selection` keys of an `InputWithMultiSelectValue` field. Same markup, same id,
 * so `aria-describedby` from `FormControl` keeps pointing at it.
 */
export default function HFInputWithMultiSelectFormMessage({ className }: { className?: string }) {
  const { error, formMessageId } = useFormField();
  const message = resolveInputWithMultiSelectErrorMessage(error);

  if (!message) {
    return null;
  }

  return (
    <p data-slot="form-message" id={ formMessageId } className={ cn('text-sm text-destructive', className) }>
      { message }
    </p>
  );
}
