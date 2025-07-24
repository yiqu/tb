import { SubscriptionWithBillDues } from '@/models/subscriptions/subscriptions.model';

export default function SubscriptionDetailsHeader({ subscription }: { subscription: SubscriptionWithBillDues }) {
  return <div>{ subscription.name }</div>;
}
