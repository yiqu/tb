'use client';

import { parseAsArrayOf } from 'nuqs';
import { parseAsString, useQueryState } from 'nuqs';

import { BILL_CYCLE_DURATION_OPTIONS } from '@/models/subscriptions/subscriptions.model';
import { AutocompleteInput, Autocomplete2Option } from '@/components/hook-form/Autocomplete2';

export default function BillsActionBarFrequencyFilter() {
  const [selectedFrequency, setSelectedFrequency] = useQueryState(
    'frequency',
    parseAsArrayOf(parseAsString)
      .withOptions({
        history: 'push',
        scroll: false,
        shallow: false
      })
      .withDefault([]),
  );

  const handleOnFrequencyChange = (values: string[] | string) => {
    setSelectedFrequency(values as string[]);
  };

  return (
    <div>
      <AutocompleteInput
        options={ BILL_CYCLE_DURATION_OPTIONS as unknown as Autocomplete2Option[] }
        placeholder="Frequency"
        onChange={ handleOnFrequencyChange }
        defaultValues={ selectedFrequency }
        multi={ true }
        className="min-w-[12rem] bg-card"
        searchBy="label"
        badgeTextMaxLength={ 10 }
      />
    </div>
  );
}
