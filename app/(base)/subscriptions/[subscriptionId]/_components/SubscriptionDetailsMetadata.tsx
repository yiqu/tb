import { Separator } from '@/components/ui/separator';
import DisplayCard from '@/shared/components/DisplayCard';
import { CardFooter, CardContent } from '@/components/ui/card';
import { SubscriptionWithBillDues } from '@/models/subscriptions/subscriptions.model';

import SubscriptionDetailsMetadataData from './SubscriptionDetailsMetadataData';
import SubscriptionDetailsMetadataFooter from './SubscriptionDetailsMetadataFooter';
import SubscriptionDetailsMetadataSubscriptionImage from './SubscriptionDetailsMetadataSubscriptionImage';

export default function SubscriptionDetailsMetadata({ subscription }: { subscription: SubscriptionWithBillDues }) {
  return (
    <DisplayCard className="w-full">
      <CardContent>
        <div className="grid grid-cols-6 gap-4">
          <div className="col-span-2">
            <div className="flex h-full items-center justify-center select-none">
              <SubscriptionDetailsMetadataSubscriptionImage
                subscriptionName={ subscription.name }
                frequency={ subscription.billCycleDuration }
              />
            </div>
          </div>
          <div className="col-span-4">
            <SubscriptionDetailsMetadataData subscription={ subscription } />
          </div>
        </div>
      </CardContent>
      <Separator orientation="horizontal" className="w-full" />
      <CardFooter className="">
        <SubscriptionDetailsMetadataFooter subscription={ subscription } />
      </CardFooter>
    </DisplayCard>
  );
}
