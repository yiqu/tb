import z from 'zod';

import { CardContent } from '@/components/ui/card';
import DisplayCard from '@/shared/components/DisplayCard';
import { SORT_DATA_PAGE_IDS } from '@/constants/constants';
import { SortDataModel } from '@/models/sort-data/SortData.model';
import NoResultsCard from '@/components/status-cards/NoResultsCard';
import SearchTableHeaderDisplay from '@/shared/table/SearchTableHeaderDisplay';
import { Table, TableRow, TableBody, TableHeader } from '@/components/ui/table';
import { getSortDataForPageIdCached } from '@/server/sort-data/sort-data.server';
import { PaginationDataModel } from '@/models/pagination-data/pagination-data.model';
import { SearchTableColumn, SUBSCRIPTIONS_TABLE_COLUMN_IDS } from '@/shared/table/table.utils';
import { subscriptionSearchParamsSchema } from '@/validators/subscriptions/subscriptions.schema';
import { getAllSubscriptionsWithBillDuesPaginated } from '@/server/subscriptions/subscriptions.server';
import { SubscriptionWithBillDues, SubscriptionWithBillDuesAndSortData } from '@/models/subscriptions/subscriptions.model';

import SubscriptionsTableParentRow from './SubscriptionsTableParentRow';

interface SubscriptionsTableParentProps {
  searchParamsPromise: Promise<z.infer<typeof subscriptionSearchParamsSchema>>;
  paginationPromise: Promise<PaginationDataModel | null>;
}

export default async function SubscriptionsTableParent({ searchParamsPromise, paginationPromise }: SubscriptionsTableParentProps) {
  const searchParams: z.infer<typeof subscriptionSearchParamsSchema> = await searchParamsPromise;
  const pagination: PaginationDataModel | null = await paginationPromise;
  const sortData: SortDataModel | null = await getSortDataForPageIdCached(SORT_DATA_PAGE_IDS.subscriptions);
  const subscriptions: SubscriptionWithBillDuesAndSortData = await getAllSubscriptionsWithBillDuesPaginated(
    sortData,
    pagination,
    searchParams,
  );
  const columnsSorted: SearchTableColumn[] = SUBSCRIPTIONS_TABLE_COLUMN_IDS.sort((a, b) => a.ordinal - b.ordinal);
  
  if (subscriptions.subscriptions.length === 0) {
    return (
      <div className="mt-6 flex w-full flex-col items-center justify-center gap-y-2">
        <NoResultsCard blendBg={ true } blendTextAreaBorder={ true } />
      </div>
    );
  }

  return (
    <DisplayCard className="w-full py-0">
      <CardContent className="overflow-x-auto px-0">
        <Table className={ `
          table-auto
          two:table-fixed
        ` }>
          <TableHeader className={ `
            bg-sidebar-accent/70
            dark:bg-sidebar-accent/100
          ` }>
            <TableRow className="hover:bg-transparent">
              { columnsSorted.map((column: SearchTableColumn, index: number, array: SearchTableColumn[]) => {
                return (
                  <SearchTableHeaderDisplay
                    key={ column.headerId }
                    columnId={ column.headerId }
                    index={ index }
                    length={ array.length }
                    sortData={ subscriptions.sortData }
                    pageId={ SORT_DATA_PAGE_IDS.subscriptions }
                  />
                );
              }) }
            </TableRow>
          </TableHeader>
          <TableBody>
            { subscriptions.subscriptions.map((subscription: SubscriptionWithBillDues) => (
              <SubscriptionsTableParentRow key={ subscription.id } subscription={ subscription } />
            )) }
          </TableBody>
        </Table>
      </CardContent>
    </DisplayCard>
  );
}
