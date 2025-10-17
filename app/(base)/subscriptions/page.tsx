import z from 'zod';
import { Suspense } from 'react';

import { SORT_DATA_PAGE_IDS } from '@/constants/constants';
import { PaginationDataModel } from '@/models/pagination-data/pagination-data.model';
import { subscriptionSearchParamsSchema } from '@/validators/subscriptions/subscriptions.schema';
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

interface SubscriptionsPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<z.infer<typeof subscriptionSearchParamsSchema>>;
}

export default function SubscriptionsPage({ searchParams }: SubscriptionsPageProps) {
  console.log("PAGE TSX");
  const paginationPromise: Promise<PaginationDataModel | null> = getPaginationDataForPageIdCached(SORT_DATA_PAGE_IDS.subscriptions);

  return (
    <div className="flex w-full flex-col items-start justify-start gap-y-3">
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
    </div>
  );
}
