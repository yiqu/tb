'use client';

import { useMemo } from 'react';
import { useQueryStates } from 'nuqs';

import RowStack from '@/shared/components/RowStack';
import ColumnStack from '@/shared/components/ColumnStack';
import Typography from '@/components/typography/Typography';
import { InputWithMultiSelectSelectOption } from '@/components/input-with-multi-select/input-with-multi-select.models';
import { buildQueryParsersFromOptions } from '@/components/input-with-multi-select/nuqs/input-with-multi-select-nuqs.utils';

interface InputWithMultiSelectQueryParamsDisplayProps {
  options: InputWithMultiSelectSelectOption[];
}

/**
 * Live read-out of the query params owned by the option list. Subscribes through nuqs itself so
 * it also picks up shallow (client only) URL updates.
 */
export default function InputWithMultiSelectQueryParamsDisplay({ options }: InputWithMultiSelectQueryParamsDisplayProps) {
  const parsers = useMemo(() => buildQueryParsersFromOptions(options), [options]);
  const [queryValues] = useQueryStates(parsers);

  return (
    <ColumnStack className="w-full gap-y-1 rounded-md bg-muted p-3">
      <Typography variant="label1">Live query params</Typography>
      { options.map((option: InputWithMultiSelectSelectOption) => (
        <RowStack key={ option.id } className="items-center gap-x-2">
          <Typography variant="code1" className="text-muted-foreground">
            ?{ option.queryParam }
          </Typography>
          <Typography variant="code1">{ queryValues[option.queryParam] ?? '—' }</Typography>
        </RowStack>
      )) }
    </ColumnStack>
  );
}
