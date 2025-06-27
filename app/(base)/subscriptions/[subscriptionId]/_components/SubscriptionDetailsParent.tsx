'use cache';

interface SubscriptionDetailsParentProps {
  paramsPromise: Promise<{ subscriptionId: string }>;
}

export default async function SubscriptionDetailsParent({ paramsPromise }: SubscriptionDetailsParentProps) {
  const subId = (await paramsPromise).subscriptionId;

  return <div>{ subId }</div>;
}
