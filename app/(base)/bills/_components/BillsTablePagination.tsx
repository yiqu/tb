import Pagination from '@mui/material/Pagination';

import z from 'zod';

import { Separator } from '@/components/ui/separator';
import { SORT_DATA_PAGE_IDS } from '@/constants/constants';
import Typography from '@/components/typography/Typography';
import { SortDataModel } from '@/models/sort-data/SortData.model';
import { billSearchParamsSchema } from '@/validators/bills/bill.schema';
import { BillDueWithSubscriptionAndSortData } from '@/models/bills/bills.model';
import { getSortDataForPageIdCached } from '@/server/sort-data/sort-data.server';
import { getAllBillsCached, getAllBillsCountCached } from '@/server/bills/bills.server';

interface BillsTablePaginationProps {
  searchParamsPromise: Promise<z.infer<typeof billSearchParamsSchema>>;
}

export default async function BillsTablePagination({ searchParamsPromise }: BillsTablePaginationProps) {
  const searchParams: z.infer<typeof billSearchParamsSchema> = await searchParamsPromise;
  const sortData: SortDataModel | null = await getSortDataForPageIdCached(SORT_DATA_PAGE_IDS.search);
  const billDues: BillDueWithSubscriptionAndSortData = await getAllBillsCached(sortData, searchParams);
  const totalBillsCount: number = await getAllBillsCountCached();
  const billsCount = billDues.billDues.length;

  const searchParamsKeys = Object.keys(searchParams);
  const hasSearchParams: boolean = searchParamsKeys.length > 0;

  return (
    <div className="flex w-full flex-row items-center justify-between">
      <div>{ `` }</div>
      <div className="flex flex-row items-center justify-end gap-x-4">
        <div>
          <Typography>
            1 - X of { billsCount }{ ' ' }
            { hasSearchParams ?
              <span> ({ totalBillsCount })</span>
            : null }
          </Typography>
        </div>
        <Separator orientation="vertical" className="h-[1.2rem]!" />
        <Pagination count={ 10 } shape="rounded" size="medium" />
      </div>
    </div>
  );
}
