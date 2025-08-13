'use client';

import { use } from 'react';
import * as React from 'react';
import toast from 'react-hot-toast';

import { SORT_DATA_PAGE_IDS } from '@/constants/constants';
import { PaginationDataModel } from '@/models/pagination-data/pagination-data.model';
import { upsertPaginationData } from '@/server/pagination-data/pagination-data.server';
import { Select, SelectItem, SelectGroup, SelectLabel, SelectValue, SelectContent, SelectTrigger } from '@/components/ui/select';

export default function OutstandingBillsTablePaginationPageCountSelectList({
  paginationPromise,
}: {
  paginationPromise: Promise<PaginationDataModel | null>;
}) {
  const pagination: PaginationDataModel | null = use(paginationPromise);
  const currentPageSize: number = pagination?.pageSize ?? 10;

  const handleOnChangePageSize = async (value: string) => {
    await toast.promise(
      upsertPaginationData({
        id: pagination?.id ?? '',
        pageId: SORT_DATA_PAGE_IDS.outstanding,
        pageSize: Number.parseInt(value),
      }),
      {
        loading: 'Updating...',
        success: `Updated outstanding bills page size: ${value}`,
        error: `Failed to update outstanding bills page size to ${value}`,
      },
    );
  };

  return (
    <div>
      <Select defaultValue={ `${currentPageSize}` } onValueChange={ handleOnChangePageSize }>
        <SelectTrigger className="w-[15rem]">
          <SelectValue placeholder="Update items per page" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Items per page</SelectLabel>
            { ITEM_PER_PAGE_OPTIONS.map((option) => (
              <SelectItem key={ option.value } value={ option.value.toString() }>
                { option.label }
              </SelectItem>
            )) }
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

const ITEM_PER_PAGE_OPTIONS = [
  {
    label: '10',
    value: '10',
  },
  {
    label: '20',
    value: '20',
  },
  {
    label: '25',
    value: '25',
  },
  {
    label: '50',
    value: '50',
  },
  {
    label: '100',
    value: '100',
  },
  {
    label: '200',
    value: '200',
  },
];
