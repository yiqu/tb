'use client';

import { cn } from '@/lib/utils';
import { Select, SelectItem, SelectValue, SelectContent, SelectTrigger } from '@/components/ui/select';

import { InputWithMultiSelectSelectOption } from './input-with-multi-select.models';

interface InputWithMultiSelectOptionSelectProps {
  /** Options rendered in the dropdown. */
  options: InputWithMultiSelectSelectOption[];
  /** Id of the currently selected option, `null` when the option list is empty. */
  selectedOptionId: string | null;
  /** Fires with the full option object whenever the user picks a different one. */
  onOptionChange: (option: InputWithMultiSelectSelectOption) => void;
  disabled?: boolean;
  /** Accessible label of the dropdown trigger. */
  label?: string;
  className?: string;
  contentClassName?: string;
}

/**
 * Left hand side of `InputWithMultiSelect`: picks which "kind" of value the user is about to type.
 * Rendered flush against the input, so its right corners and border are squared off.
 */
export default function InputWithMultiSelectOptionSelect({
  options,
  selectedOptionId,
  onOptionChange,
  disabled,
  label = 'Select an option',
  className,
  contentClassName,
}: InputWithMultiSelectOptionSelectProps) {
  const handleOnValueChange = (optionId: string) => {
    const nextOption = options.find((option: InputWithMultiSelectSelectOption) => option.id === optionId);
    if (nextOption) {
      onOptionChange(nextOption);
    }
  };

  return (
    // `''` rather than `undefined` for "nothing selected": Radix shows the placeholder for both,
    // but `undefined` would make the select uncontrolled until the user picks an option.
    <Select value={ selectedOptionId ?? '' } onValueChange={ handleOnValueChange } disabled={ disabled || options.length === 0 }>
      <SelectTrigger
        aria-label={ label }
        className={ cn(
          `
            shrink-0 rounded-r-none border-r-0 bg-muted/40
            focus-visible:z-10
            dark:bg-muted/20
          `,
          className,
        ) }
      >
        <SelectValue placeholder={ label } />
      </SelectTrigger>
      <SelectContent className={ cn(contentClassName) }>
        { options.map((option: InputWithMultiSelectSelectOption) => (
          <SelectItem key={ option.id } value={ option.id }>
            { option.display }
          </SelectItem>
        )) }
      </SelectContent>
    </Select>
  );
}
