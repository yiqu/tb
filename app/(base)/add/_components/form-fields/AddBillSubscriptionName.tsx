import { Separator } from '@/components/ui/separator';
import Typography from '@/components/typography/Typography';
import { SubscriptionWithBillDues } from '@/models/subscriptions/subscriptions.model';
import { getSubscriptionWithBillDuesByIdCached } from '@/server/subscriptions/subscriptions.server';

export default async function AddBillSubscriptionName({ subscriptionId }: { subscriptionId?: string }) {
  if (!subscriptionId) {
    return null;
  }

  const subscription: SubscriptionWithBillDues | null = await getSubscriptionWithBillDuesByIdCached(subscriptionId ?? '');

  return (
    <div className="flex w-full flex-col gap-y-4">
      <Typography className="font-semibold" variant="body2">{ subscription?.name }</Typography>
      <Separator />
    </div>
  );
}
