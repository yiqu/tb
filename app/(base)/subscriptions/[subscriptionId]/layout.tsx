import { Metadata } from 'next';
import { Suspense, ReactNode } from 'react';

import { Skeleton } from '@/components/ui/skeleton';

import SubscriptionDetailsHeader from './_components/SubscriptionDetailsHeader';

interface SubscriptionDetailsLayoutProps {
  children: ReactNode;
  params: Promise<{ subscriptionId: string }>;
}

export const metadata: Metadata = {
  title: 'Subscription Details',
  description: 'View the details of a subscription.',
};

export const experimental_ppr = true;

export default function SubscriptionDetailsLayout({ children, params }: SubscriptionDetailsLayoutProps) {
  return (
    <div id="subscription-details-layout-parent" className="flex w-full flex-col items-start justify-start gap-y-3">
      <Suspense fallback={ <HeaderSkeleton /> }>
        <SubscriptionDetailsHeader subscriptionPromise={ params } />
      </Suspense>
      { children }
    </div>
  );
}

function HeaderSkeleton() {
  return (
    <div className="flex w-full flex-row items-center justify-start">
      <Skeleton className="h-13 w-full" />
    </div>
  );
}
