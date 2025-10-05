'use client';

import { useQueryState } from 'nuqs';
import { CirclePlus, CircleMinus } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface TableCellHoverFilterAddButtonProps {
  payload: string;
  columnId: string;
}

export function TableCellHoverFilterAddButton({ payload, columnId }: TableCellHoverFilterAddButtonProps) {
  const [filterValue, setFilter] = useQueryState(columnId, {
    scroll: false,
    shallow: false,
    history: 'push',
  });
  const isPayloadAlreadyInFilter: boolean = (filterValue ?? '').includes(payload);

  const handleOnClick = () => {
    if (isPayloadAlreadyInFilter) {
      // extract the remaining filter value
      const filters: string[] = (filterValue ?? '').trim().split(',');
      const newFilters = filters.filter((filter) => filter !== payload);
      const newFilterValue = newFilters.join(',');
      setFilter(newFilterValue === '' ? null : newFilterValue);
    } else {
      setFilter(payload);
    }
  };

  if (isPayloadAlreadyInFilter) {
    return (
      <div className="flex h-3 flex-row items-center justify-start">
        <Button size="icon" className="size-6" variant="ghost" title="Remove from filter" onClick={ handleOnClick }>
          <CircleMinus className="size-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-3 flex-row items-center justify-start">
      <Button size="icon" className="size-6" variant="ghost" title="Add to filter" onClick={ handleOnClick }>
        <CirclePlus className="size-4" />
      </Button>
    </div>
  );
}
