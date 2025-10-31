import { Metadata } from 'next';
import { Suspense } from 'react';

import { appName } from '@/constants/constants';
import { Skeleton } from '@/components/ui/skeleton';

import SubscriptionDetailsHeader from './_components/SubscriptionDetailsHeader';

export const metadata: Metadata = {
  title: {
    template: `%s | ${appName}`,
    default: `Subscription Details | ${appName}`, // a default is required when creating a template
  },
  description: 'View the details of a subscription.',
};

export default function SubscriptionDetailsLayout({ children, params }: LayoutProps<'/subscriptions/[subscriptionId]'>) {
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
