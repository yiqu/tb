'use client';

import { useQuery } from '@tanstack/react-query';

import Typography from '@/components/typography/Typography';
import ColumnStack from '@/shared/components/ColumnStack';
import MultiSortSelect from '@/shared/multi-sort/MultiSortSelect';
import useMultiSortValues from '@/shared/multi-sort/useMultiSortValues';
import { getFakeSortedSearchQueryOptions } from '@/shared/multi-sort/multi-sort.query';

export default function MultiSortDemo() {
  const { sortConfig, searchParamsString } = useMultiSortValues();

  const { data, isFetching } = useQuery(getFakeSortedSearchQueryOptions(sortConfig, searchParamsString));

  return (
    <ColumnStack className="w-full gap-y-4">
      <ColumnStack className="gap-y-1">
        <Typography variant="h6">Multi sort</Typography>
        <MultiSortSelect maxWidth="24rem" />
      </ColumnStack>

      <ColumnStack className="gap-y-1">
        <Typography variant="label0">Raw SortConfig array:</Typography>
        <Typography variant="code0" as="pre" className="rounded-md bg-muted p-2">
          { JSON.stringify(sortConfig, null, 2) }
        </Typography>
      </ColumnStack>

      <ColumnStack className="gap-y-1">
        <Typography variant="label0">URLSearchParams string:</Typography>
        <Typography variant="code0" as="pre" className="rounded-md bg-muted p-2 break-all whitespace-pre-wrap">
          { searchParamsString }
        </Typography>
      </ColumnStack>

      <ColumnStack className="gap-y-1">
        <Typography variant="label0">Fake GET request (TanStack Query):</Typography>
        { isFetching ?
          <Typography variant="nodata1">Fetching...</Typography>
        : <Typography variant="code0" as="pre" className="rounded-md bg-muted p-2 break-all whitespace-pre-wrap">
            { data?.requestUrl }
          </Typography>
        }
      </ColumnStack>
    </ColumnStack>
  );
}
