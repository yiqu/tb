'use client';

import { parseAsString } from 'nuqs';
import { parseAsArrayOf, parseAsInteger, useQueryStates } from 'nuqs';

import { BILL_CYCLE_DURATION_OPTIONS } from '@/models/subscriptions/subscriptions.model';
import { AutocompleteInput, Autocomplete2Option } from '@/components/hook-form/Autocomplete2';

export default function BillsActionBarFrequencyFilter() {
  const [selectedFrequency, setSelectedFrequency] = useQueryStates(
    {
      frequency: parseAsArrayOf(parseAsString)
        .withOptions({
          history: 'push',
          scroll: false,
          shallow: false,
        })
        .withDefault([]),
      page: parseAsInteger
        .withOptions({
          history: 'push',
          scroll: false,
          shallow: false,
        })
        .withDefault(1),
    },
    {
      history: 'push',
      scroll: false,
      shallow: false,
    },
  );

  const handleOnFrequencyChange = (values: string[] | string) => {
    setSelectedFrequency({
      frequency: values as string[],
      page: 1,
    });
  };

  return (
    <div>
      <AutocompleteInput
        options={ BILL_CYCLE_DURATION_OPTIONS as unknown as Autocomplete2Option[] }
        placeholder="Frequency"
        onChange={ handleOnFrequencyChange }
        defaultValues={ selectedFrequency.frequency }
        multi={ true }
        className="min-w-[12rem] bg-card"
        searchBy="label"
        badgeTextMaxLength={ 10 }
      />
    </div>
  );
}
