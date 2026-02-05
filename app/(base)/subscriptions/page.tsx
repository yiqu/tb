import { Suspense } from 'react';

import ColumnStack from '@/shared/components/ColumnStack';
import { SORT_DATA_PAGE_IDS } from '@/constants/constants';
import { PaginationDataModel } from '@/models/pagination-data/pagination-data.model';
import { getPaginationDataForPageIdCached } from '@/server/pagination-data/pagination-data.server';

import SubscriptionsTableParent from './_components/SubscriptionsTableParent';
import SubscriptionsTableSkeleton from './_components/SubscriptionsTableSkeleton';
import SubscriptionsTableActionBar from './_components/SubscriptionsTableActionBar';
import SubscriptionsTableActionDialog from './_components/SubscriptionsTableActionDialog';
import AddNewBillDueDialogStandalone from '../add/_components/AddNewBillDueDialogStandalone';
import AddSubscriptionDialogContentCard from '../add/_components/AddSubscriptionDialogContentCard';
import SubscriptionsTablePaginationWrapper from './_components/SubscriptionsTablePaginationWrapper';
import EditSubscriptionDialogContentCard from '../add/_components/EditSubscriptionDialogContentCard';
import AddNewBillDueDialogContentStandalone from '../add/_components/AddNewBillDueDialogContentStandalone';
import SubscriptionsTableAddSubscriptionDialog from './_components/SubscriptionsTableAddSubscriptionDialog';

export default function SubscriptionsPage({ searchParams }: PageProps<'/subscriptions'>) {
  const paginationPromise: Promise<PaginationDataModel | null> = getPaginationDataForPageIdCached(SORT_DATA_PAGE_IDS.subscriptions);

  return (
    <ColumnStack className="w-full gap-y-3">
      <SubscriptionsTableActionBar />
      <SubscriptionsTablePaginationWrapper searchParams={ searchParams } />
      <Suspense fallback={ <SubscriptionsTableSkeleton /> }>
        <SubscriptionsTableParent searchParamsPromise={ searchParams } paginationPromise={ paginationPromise } />
      </Suspense>
      <Suspense>
        <SubscriptionsTableActionDialog>
          <EditSubscriptionDialogContentCard />
        </SubscriptionsTableActionDialog>
      </Suspense>
      <Suspense>
        <SubscriptionsTableAddSubscriptionDialog>
          <AddSubscriptionDialogContentCard />
        </SubscriptionsTableAddSubscriptionDialog>
      </Suspense>
      <Suspense>
        <AddNewBillDueDialogStandalone>
          <AddNewBillDueDialogContentStandalone searchParams={ searchParams } />
        </AddNewBillDueDialogStandalone>
      </Suspense>
    </ColumnStack>
  );
}
