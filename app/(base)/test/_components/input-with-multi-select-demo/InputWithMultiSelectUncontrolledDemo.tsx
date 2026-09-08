'use client';

import { useState } from 'react';

import ColumnStack from '@/shared/components/ColumnStack';
import Typography from '@/components/typography/Typography';
import InputWithMultiSelect from '@/components/input-with-multi-select/InputWithMultiSelect';
import { InputWithMultiSelectValue } from '@/components/input-with-multi-select/input-with-multi-select.models';

import { ID_SEARCH_OPTIONS } from './input-with-multi-select-demo.constants';

/**
 * The plain, uncontrolled component: no nuqs, no react-hook-form. State lives inside, and the
 * whole `InputWithMultiSelectValue` comes back through `onChange` on Enter / trigger click only.
 */
export default function InputWithMultiSelectUncontrolledDemo() {
  const [submittedValue, setSubmittedValue] = useState<InputWithMultiSelectValue | null>(null);
  const [submitCount, setSubmitCount] = useState<number>(0);

  const handleOnChange = (value: InputWithMultiSelectValue) => {
    setSubmittedValue(value);
    setSubmitCount((count: number) => count + 1);
  };

  return (
    <ColumnStack className="w-full gap-y-2 rounded-md border p-4">
      <Typography variant="h5">InputWithMultiSelect — uncontrolled</Typography>
      <Typography variant="caption1">
        Defaults to the first option (User ID). Changing the dropdown does not fire <Typography variant="code1" as="span">onChange</Typography>
        — only Enter or the trigger icon does, and the value below is the raw
        <Typography variant="code1" as="span"> InputWithMultiSelectValue</Typography>.
      </Typography>
      <InputWithMultiSelect
        options={ ID_SEARCH_OPTIONS }
        defaultInputValue="abc-123"
        onChange={ handleOnChange }
        placeholder="Type an id and press Enter..."
        maxLength={ 64 }
      />
      <ColumnStack className="gap-y-1">
        <Typography variant="label1">Last submitted value (submits: { submitCount })</Typography>
        <Typography variant="code1" className="rounded-md bg-muted p-2 whitespace-pre-wrap">
          { submittedValue ? JSON.stringify(submittedValue, null, 2) : 'Nothing submitted yet' }
        </Typography>
      </ColumnStack>
    </ColumnStack>
  );
}
