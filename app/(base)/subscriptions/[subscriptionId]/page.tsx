import { headers } from 'next/headers';
import { connection } from 'next/server';
import { Metadata, ResolvingMetadata } from 'next';

import { appName } from '@/constants/constants';
import { getSubscriptionLogoUrl } from '@/shared/table/table.utils';
import { BillDueWithSubscription } from '@/models/bills/bills.model';
import { transformSubscriptionExtraPropsForFavorite } from '@/server/subscriptions/utils';
import { SubscriptionOriginal, SubscriptionWithBillDues } from '@/models/subscriptions/subscriptions.model';
import { getAllSubscriptionsBareCached, getSubscriptionWithBillDuesByIdCached } from '@/server/subscriptions/subscriptions.server';

import SubscriptionDetailsParent from './_components/SubscriptionDetailsParent';

interface SubscriptionDetailsPageProps {
  params: Promise<{ subscriptionId: string }>;
}

export async function generateMetadata(
  { params }: LayoutProps<'/subscriptions/[subscriptionId]'>,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  await connection();
  // read route params
  const { subscriptionId } = await params;

  // fetch data
  const subscription: SubscriptionWithBillDues | null = await getSubscriptionWithBillDuesByIdCached(subscriptionId);
  const subscriptionsWithFavoriteProps: SubscriptionWithBillDues[] = transformSubscriptionExtraPropsForFavorite(
    subscription ? [subscription] : [],
  );
  const subscriptionWithFavoriteProps = subscriptionsWithFavoriteProps[0];
  const outstandingBillDues: BillDueWithSubscription[] =
    subscriptionWithFavoriteProps.billDuesWithinTimeRangeThatIsNotPaidOrReimbursed ?? [];
  const hasOutstandingBillDues: boolean = outstandingBillDues.length > 0;
  const outstandingBillDuesInfo = `${outstandingBillDues.length}`;

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];
  const { light } = getSubscriptionLogoUrl(subscription?.name ?? '');

  // Get the current host from headers to construct absolute URL
  const headersList = await headers();
  const host = headersList.get('host') || 'localhost:3000';
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const absoluteImageUrl = `${protocol}://${host}${light}`;

  return {
    title: `${hasOutstandingBillDues ? `!(${outstandingBillDuesInfo})` : `(Good)`} - ${subscription?.name ?? 'Subscription'} Details | Subscription | ${appName}`,
    openGraph: {
      images: [absoluteImageUrl, ...previousImages],
    },
    description: `View the details of the ${subscription?.name ?? 'subscription'} subscription.`,
  };
}

// Return a list of `params` to populate the [subscriptionId] dynamic segment
export async function generateStaticParams() {
  const subscriptions: SubscriptionOriginal[] = await getAllSubscriptionsBareCached();

  return subscriptions.map((subscription) => ({
    subscriptionId: subscription.id,
  }));
}

export default async function SubscriptionDetailsPage({ params }: SubscriptionDetailsPageProps) {
  return <SubscriptionDetailsParent paramsPromise={ params } />;
}
