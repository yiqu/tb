import z from 'zod';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import DisplayCard from '@/shared/components/DisplayCard';
import { SORT_DATA_PAGE_IDS } from '@/constants/constants';
import Typography from '@/components/typography/Typography';
import { CardFooter, CardContent } from '@/components/ui/card';
import { SortDataModel } from '@/models/sort-data/SortData.model';
import { getSortDataForPageIdCached } from '@/server/sort-data/sort-data.server';
import { PaginationDataModel } from '@/models/pagination-data/pagination-data.model';
import { BillSearchParams, billSearchParamsSchema } from '@/validators/bills/bill.schema';
import { getAllBillsCached, getCurrentMonthDateDataCached } from '@/server/bills/bills.server';
import { CurrentMonthDateData, BillDueWithSubscriptionAndSortData } from '@/models/bills/bills.model';

import DateRangeEpochButton from './DateRangeEpochButton';
import { appendMonthAndYearToSearchParams } from './dashboard.utils';
import BillsTableParentContent from '../../bills/_components/BillsTableParentContent';
interface BillsTableParentProps {
  searchParamsPromise: Promise<z.infer<typeof billSearchParamsSchema>>;
  paginationPromise: Promise<PaginationDataModel | null>;
}

export default async function BillsTableParent({ searchParamsPromise, paginationPromise }: BillsTableParentProps) {
  // get the current month and year from server
  const dateData: CurrentMonthDateData = await getCurrentMonthDateDataCached();
  const dateParamsData: BillSearchParams = await dateData.dateSearchParamsPromise;

  // use server month and year if searchParams are not set
  let searchParams: BillSearchParams = await searchParamsPromise;
  searchParams = appendMonthAndYearToSearchParams(searchParams, dateParamsData);

  const pagination: PaginationDataModel | null = await paginationPromise;
  const sortData: SortDataModel | null = await getSortDataForPageIdCached(SORT_DATA_PAGE_IDS.dashboard_current_month);
  const billDues: BillDueWithSubscriptionAndSortData = await getAllBillsCached(sortData, pagination, searchParams);

  if (billDues.billDues.length === 0) {
    const { monthParams } = billDues;
    const { yearParams } = billDues;
    return (
      <div className="mt-6 flex w-full flex-col items-center justify-center gap-y-6">
        <Typography>
          No bills due in { monthParams }/{ yearParams }.
        </Typography>
        <div className="flex flex-col items-center justify-center gap-y-2">
          <div className="flex flex-row items-center justify-start gap-x-2">
            <Button variant="link">
              <Link href="/add/subscription" prefetch className="flex flex-row items-center gap-x-2">
                <ArrowRight />
                Add a new subscription
              </Link>
            </Button>
            <Button variant="link">
              <Link href="/add/bill" prefetch className="flex flex-row items-center gap-x-2">
                <ArrowRight />
                Add a new bill
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DisplayCard className="w-full pt-0 shadow-none">
      <CardContent className="overflow-x-auto border-b px-0">
        <BillsTableParentContent
          billDues={ billDues }
          tableId="dashboard-bills-table"
          sortData={ billDues.sortData }
          pageId={ SORT_DATA_PAGE_IDS.dashboard_current_month }
        />
        { /* <Table className="table-fixed" id="bills-table">
          <TableHeader className={ `bg-muted` }>
            <TableRow className="hover:bg-transparent">
              { columnsSorted.map((column: string, index: number, array: string[]) => {
                return (
                  <SearchTableHeaderDisplay
                    key={ column }
                    columnId={ column }
                    index={ index }
                    length={ array.length }
                    sortData={ billDues.sortData }
                    pageId={ SORT_DATA_PAGE_IDS.dashboard_current_month }
                    sortable={ unsortableBillsColumns[column] ?? true }
                  />
                );
              }) }
            </TableRow>
          </TableHeader>
          <TableBody>
            { billDues.billDues.map((billDue: BillDueWithSubscription) => (
              <BillsTableParentRow key={ billDue.id } billDue={ billDue } columns={ columnsSorted } />
            )) }
          </TableBody>
        </Table> */ }
      </CardContent>
      <CardFooter className="flex w-full flex-row items-center justify-between">
        <div>
          <DateRangeEpochButton billDuesData={ billDues } />
        </div>
        <div></div>
      </CardFooter>
    </DisplayCard>
  );
}
