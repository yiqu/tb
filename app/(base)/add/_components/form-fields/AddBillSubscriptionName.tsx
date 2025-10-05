import { Separator } from '@/components/ui/separator';
import Typography from '@/components/typography/Typography';

export default function AddBillSubscriptionName({ subscriptionName }: { subscriptionName?: string }) {
  return (
    <div className="flex w-full flex-col gap-y-4">
      <Typography className="font-semibold" variant="body2">
        { subscriptionName ?? 'No subscription name' }
      </Typography>
      <Separator />
    </div>
  );
}
