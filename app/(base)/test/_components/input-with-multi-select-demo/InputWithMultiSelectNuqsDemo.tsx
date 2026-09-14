'use client';

import { Options } from 'nuqs';
import { useState, ReactNode } from 'react';

import ColumnStack from '@/shared/components/ColumnStack';
import Typography from '@/components/typography/Typography';
import InputWithMultiSelectNuqs from '@/components/input-with-multi-select/nuqs/InputWithMultiSelectNuqs';
import { InputWithMultiSelectValue, InputWithMultiSelectSelectOption } from '@/components/input-with-multi-select/input-with-multi-select.models';

interface InputWithMultiSelectNuqsDemoProps {
  title: string;
  description: ReactNode;
  options: InputWithMultiSelectSelectOption[];
  nuqsOptions?: Options;
  defaultSelectedOptionId?: string;
  clearOtherQueryParams?: boolean;
  updateQueryOnSelectionChange?: boolean;
  updateQueryOnInputChange?: boolean;
  placeholder?: string;
  triggerIcon?: ReactNode;
  className?: string;
  selectClassName?: string;
  triggerClassName?: string;
}

/**
 * One nuqs test case: renders `InputWithMultiSelectNuqs` with a given set of nuqs options and
 * echoes back the last submitted value so the URL update can be compared against it.
 */
export default function InputWithMultiSelectNuqsDemo({
  title,
  description,
  options,
  nuqsOptions,
  defaultSelectedOptionId,
  clearOtherQueryParams,
  updateQueryOnSelectionChange,
  updateQueryOnInputChange,
  placeholder,
  triggerIcon,
  className,
  selectClassName,
  triggerClassName,
}: InputWithMultiSelectNuqsDemoProps) {
  const [lastSubmitted, setLastSubmitted] = useState<InputWithMultiSelectValue | null>(null);

  return (
    <ColumnStack className="w-full gap-y-2 rounded-md border p-4">
      <Typography variant="h6">{ title }</Typography>
      <Typography variant="caption1">{ description }</Typography>
      <InputWithMultiSelectNuqs
        options={ options }
        nuqsOptions={ nuqsOptions }
        defaultSelectedOptionId={ defaultSelectedOptionId }
        clearOtherQueryParams={ clearOtherQueryParams }
        updateQueryOnSelectionChange={ updateQueryOnSelectionChange }
        updateQueryOnInputChange={ updateQueryOnInputChange }
        placeholder={ placeholder ?? 'Type an id and hit Enter...' }
        triggerIcon={ triggerIcon }
        onChange={ setLastSubmitted }
        className={ className }
        selectClassName={ selectClassName }
        triggerClassName={ triggerClassName }
      />
      <Typography variant="code1" className="rounded-md bg-muted p-2 whitespace-pre-wrap">
        { lastSubmitted ? `${lastSubmitted.selection?.queryParam ?? '—'} = ${lastSubmitted.input.trim() || '—'}` : 'Nothing submitted yet' }
      </Typography>
    </ColumnStack>
  );
}
