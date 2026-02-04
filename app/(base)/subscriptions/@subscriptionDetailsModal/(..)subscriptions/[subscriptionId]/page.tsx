import { Dialog, DialogContent } from '@/components/ui/dialog';

export default function SubscriptionDetailsModalPage({
  params: _params,
}: {
  params: Promise<{ subscriptionId: string }>;
}) {
  return (
    <Dialog open>
      <DialogContent>
        <p>Subscription Details Modal</p>
        <p>This is the intercepted route modal!</p>
      </DialogContent>
    </Dialog>
  );
}
