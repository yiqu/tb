'use client';

import Pagination from '@mui/material/Pagination';

import { ChangeEvent } from 'react';
import { useQueryState, parseAsInteger } from 'nuqs';

export default function SubscriptionsTablePaginationPageSelect({ pageCount }: { pageCount: number }) {
  const [selectedPage, setSelectedPage] = useQueryState(
    'page',
    parseAsInteger
      .withOptions({
        history: 'push',
        scroll: false,
        shallow: false,
      })
      .withDefault(1),
  );

  const handlePageChange = (event: ChangeEvent<unknown>, page: number) => {
    if (selectedPage === page) {
      return;
    }
    setSelectedPage(page);
  };

  return (
    <Pagination
      count={ pageCount }
      shape="rounded"
      size="medium"
      showFirstButton={ true }
      showLastButton={ true }
      page={ selectedPage }
      siblingCount={ 2 }
      onChange={ handlePageChange }
    />
  );
}
