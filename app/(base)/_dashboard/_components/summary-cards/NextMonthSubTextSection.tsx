import { Separator } from '@/components/ui/separator';
import Typography from '@/components/typography/Typography';
import SubscriptionLogoAvatar from '@/components/logos/SubscriptionLogoAvatar';
import { BillDueWithSubscriptionByMonthAndYear } from '@/models/bills/bills.model';
import { getAllBillsByMonthAndYearParamsCached } from '@/server/bills/bills.server';

interface Props {
  currentMonthData: BillDueWithSubscriptionByMonthAndYear;
  selectedMonthYear: string | undefined;
}

export default async function NextMonthSubTextSection({ selectedMonthYear }: Props) {
  const nextMonthData: BillDueWithSubscriptionByMonthAndYear = await getAllBillsByMonthAndYearParamsCached(selectedMonthYear, 1);

  return (
    <div className="flex w-full flex-col justify-start gap-y-2">
      <div className="flex flex-row flex-wrap items-center justify-start gap-x-2">
        <div className="flex flex-row items-center justify-start gap-x-1">
          <Typography className="">Bills:</Typography>
          <Typography className="font-semibold tabular-nums" variant="body2">
            { nextMonthData.totalBillsCount }
          </Typography>
        </div>
        <Separator orientation="vertical" />
        <div className={ `
          flex flex-wrap space-x-1
          *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background
        ` }>
          { nextMonthData.billDues
            .toSorted((a, b) => (a.subscription.name.toLowerCase() > b.subscription.name.toLowerCase() ? 1 : -1))
            .map((billdue) => {
              return (
                <div key={ billdue.id }>
                  <SubscriptionLogoAvatar
                    subscription={ billdue.subscription }
                    avatarProps={ {
                      className: 'size-5',
                    } }
                  />
                </div>
              );
            }) }
        </div>
      </div>
    </div>
  );
}
