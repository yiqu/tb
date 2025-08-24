'use client';

import Pagination from '@mui/material/Pagination';

import { ChangeEvent } from 'react';
import { useQueryState, parseAsInteger } from 'nuqs';

export default function OutstandingBillsTablePaginationPageSelect({ pageCount }: { pageCount: number }) {
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

  const onlyHasOnePage = pageCount < 2;

  return (
    <Pagination
      count={ pageCount }
      shape="rounded"
      size="medium"
      showFirstButton={ onlyHasOnePage ? false : true }
      showLastButton={ onlyHasOnePage ? false : true }
      page={ selectedPage }
      siblingCount={ 2 }
      onChange={ handlePageChange }
    />
  );
}
