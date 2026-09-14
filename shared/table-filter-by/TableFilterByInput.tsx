'use client';

import { cn } from '@/lib/utils';
import UncontrolledInput from '@/components/hook-form/UnInput';
import { AppColumnId } from '@/store/subscriptions/table.store';
import { getTableFilterByPlaceholder } from '@/shared/table-filter-by/table-filter-by.utils';

export interface TableFilterByInputProps {
  /** The column being filtered. Supplies the default placeholder. */
  columnId: AppColumnId;
  /** Input id, for the panel's `<Label htmlFor>`. */
  id?: string;
  value: string;
  onValueChange: (_value: string) => void;
  /** Enter in the input. Wire this to Apply so the keyboard does what the button does. */
  onSubmit?: () => void;
  onClear?: () => void;
  placeholder?: string;
  className?: string;
}

/**
 * The filter's text input.
 *
 * Stops `pointerdown` and `keydown` from bubbling: both belong to the dropdown, which would
 * otherwise steal the click and treat typing as its own type-ahead.
 */
export default function TableFilterByInput({
  columnId,
  id,
  value,
  onValueChange,
  onSubmit,
  onClear,
  placeholder,
  className,
}: TableFilterByInputProps) {
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onValueChange(e.target.value);
  };

  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (e.key === 'Enter') {
      e.preventDefault();
      onSubmit?.();
    }
  };

  return (
    <UncontrolledInput
      id={ id }
      placeholder={ placeholder ?? getTableFilterByPlaceholder(columnId) }
      onKeyDown={ handleOnKeyDown }
      onPointerDown={ (e) => e.stopPropagation() }
      onFocus={ (e) => e.target.select() }
      onChange={ handleOnChange }
      value={ value }
      className={ cn(value ? 'pr-8' : '', className) }
      onClear={ onClear }
    />
  );
}
