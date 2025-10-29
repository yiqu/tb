import Image from 'next/image';
import startCase from 'lodash/startCase';
import { CircleCheck } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

import { cn } from '@/lib/utils';
import { Spinner } from '@/components/ui/spinner';
import { Skeleton } from '@/components/ui/skeleton';
import { BillDue } from '@/models/bills/bills.model';
import { getUSDFormatter } from '@/lib/number.utils';
import { Separator } from '@/components/ui/separator';
import Typography from '@/components/typography/Typography';
import SubscriptionLogo from '@/components/logos/SubscriptionLogo';
import { FavoriteEntity } from '@/models/favorites/favorite.model';
import DateRelativeDisplay from '@/shared/table/DateRelativeDisplay';
import EntityDisplayMedia from '@/shared/components/EntityDisplayMedia';
import BillsTableTogglePaidButton from '@/shared/table/BillsTableTogglePaidButton';
import { getFavoriteByIdQueryOptions } from '@/server/favorites/query/favorites.query';
import { getFrequencyImageUrl, getSubscriptionLogoSize } from '@/shared/table/table.utils';
import BillsTableToggleReimbursedButton from '@/shared/table/BillsTableToggleReimbursedButton';
import { SubscriptionOriginal, SubscriptionWithBillDues } from '@/models/subscriptions/subscriptions.model';

const usdFormatter = getUSDFormatter();

export default function FavoriteItemDetails({ favoriteEntity }: { favoriteEntity: FavoriteEntity }) {
  const {
    data: favoriteDetails,
    isLoading,
    isError,
    error,
  } = useQuery({
    ...getFavoriteByIdQueryOptions(favoriteEntity),
    enabled: !!favoriteEntity.id,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-start justify-start gap-y-2">
        <FavoriteItemDetailsSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-start justify-start gap-y-2">
        <Typography>Error: { error.message }</Typography>
      </div>
    );
  }

  if (!favoriteDetails) {
    return (
      <div className="flex flex-col items-start justify-start gap-y-2">
        <Typography>No favorite details found</Typography>
      </div>
    );
  }

  console.log('favoriteDetails', favoriteDetails);

  return (
    <div className="flex w-full flex-col items-start justify-start gap-y-2">
      <div className="flex w-full flex-row items-center justify-between gap-x-2">
        <FavoriteDetailsTitle favoriteEntity={ favoriteEntity } favoriteDetails={ favoriteDetails } />
      </div>
      <Separator />
      <FavoriteDetailsContent favoriteEntity={ favoriteEntity } favoriteDetails={ favoriteDetails } />
    </div>
  );
}

function FavoriteItemDetailsSkeleton() {
  return (
    <div className="flex w-full flex-col items-start justify-start gap-y-2">
      <Typography>Favorite Details</Typography>
      <Separator />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-full" />
    </div>
  );
}

function FavoriteDetailsTitle({
  favoriteEntity,
  favoriteDetails,
}: {
  favoriteEntity: FavoriteEntity;
  favoriteDetails: SubscriptionOriginal | BillDue | null;
}) {
  return (
    <div className="grid w-full grid-cols-10 gap-1">
      <div className="col-span-8 flex items-center">
        <FavoriteDetailsTitle2 favoriteEntity={ favoriteEntity } favoriteDetails={ favoriteDetails } />
      </div>
      <div className="col-span-2 flex items-center justify-end">
        <FavoriteDetailsStatus favoriteEntity={ favoriteEntity } favoriteDetails={ favoriteDetails } />
      </div>
    </div>
  );
}

function FavoriteDetailsTitle2({
  favoriteEntity,
  favoriteDetails,
}: {
  favoriteEntity: FavoriteEntity;
  favoriteDetails: SubscriptionOriginal | BillDue | null;
}) {
  if (favoriteEntity.entityType === 'SUBSCRIPTION') {
    const subscription = favoriteDetails as SubscriptionOriginal;
    return (
      <div className="flex w-full flex-row items-center justify-between gap-x-2 text-wrap">
        <div className="flex flex-row items-center justify-start gap-x-2">
          <SubscriptionLogo subscriptionName={ subscription.name } height={ getSubscriptionLogoSize(subscription.name) } />
          <Typography>{ subscription.name }</Typography>
        </div>
        <div className="flex flex-row items-center justify-end gap-x-1">
          <Image
            src={ getFrequencyImageUrl(subscription.billCycleDuration) }
            alt="Frequency"
            width={ 16 }
            height={ 16 }
            className={ `opacity-90` }
          />
          <Typography className="truncate">{ startCase(subscription.billCycleDuration) }</Typography>
        </div>
      </div>
    );
  }

  if (favoriteEntity.entityType === 'BILL_DUE') {
    const billDue = favoriteDetails as BillDue;
    return (
      <div className="flex w-full flex-row items-center justify-between gap-x-2 text-wrap">
        <Typography>AA</Typography>
      </div>
    );
  }
}

function FavoriteDetailsStatus({
  favoriteEntity,
  favoriteDetails,
}: {
  favoriteEntity: FavoriteEntity;
  favoriteDetails: SubscriptionOriginal | BillDue | null;
}) {
  let status1 = false;
  let status2 = false;

  if (favoriteEntity.entityType === 'SUBSCRIPTION') {
    const subscription = favoriteDetails as SubscriptionOriginal;
    status1 = subscription.approved;
    status2 = subscription.signed;
  }
  return (
    <div className="flex flex-row items-center justify-end gap-x-1">
      <CircleCheck
        className={ cn(`
          size-4 text-gray-400
          dark:text-gray-400
        `, {
          'text-green-600 dark:text-green-500': status1,
        }) }
      />
      <CircleCheck
        className={ cn(`
          size-4 text-gray-400
          dark:text-gray-400
        `, {
          'text-green-600 dark:text-green-500': status2,
        }) }
      />
    </div>
  );
}

function FavoriteDetailsContent({
  favoriteEntity,
  favoriteDetails,
}: {
  favoriteEntity: FavoriteEntity;
  favoriteDetails: SubscriptionWithBillDues | BillDue | null;
}) {
  const { isFetching, refetch } = useQuery({
    ...getFavoriteByIdQueryOptions(favoriteEntity),
    enabled: !!favoriteEntity.id,
    notifyOnChangeProps: [],
  });

  const handleOnIconClick = () => {
    refetch();
  };

  if (!favoriteDetails) {
    return (
      <div className="flex flex-col items-start justify-start gap-y-2">
        <Typography>No favorite details found</Typography>
      </div>
    );
  }

  if (favoriteEntity.entityType === 'SUBSCRIPTION') {
    const subscription = favoriteDetails as SubscriptionWithBillDues;
    const dueThisCycleText =
      subscription.billCycleDuration === 'yearly' ? 'Due this year:'
      : subscription.billCycleDuration === 'monthly' ? 'Due this month:'
      : 'Due once:';
    return (
      <div className="flex w-full flex-col items-start justify-start gap-y-2">
        <div className="grid w-full grid-cols-12 gap-2">
          <div className="col-span-1 flex cursor-pointer items-center" onClick={ handleOnIconClick }>
            { isFetching ?
              <Spinner className="size-4" />
            : <EntityDisplayMedia entity={ favoriteEntity.entityType } /> }
          </div>
          <div className="col-span-11 flex justify-end text-wrap">
            <Typography>{ favoriteEntity.name }</Typography>
          </div>
        </div>

        <div className="grid w-full grid-cols-6 gap-2">
          <div className="col-span-4 flex items-center">
            <Typography>Default Cost:</Typography>
          </div>
          <div className="col-span-2 flex justify-end text-wrap">
            <Typography>{ usdFormatter.format(subscription.cost) }</Typography>
          </div>
        </div>

        <div className="grid w-full grid-cols-6 gap-2">
          <div className="col-span-4 flex items-center">
            <Typography>CY Reimbursed / Total:</Typography>
          </div>
          <div className="col-span-2 flex justify-end text-wrap">
            <Typography variant="body1">
              { subscription.reimbursedBillsCount } / { subscription.billsWithinTimeRangeCount }
            </Typography>
          </div>
        </div>

        <Separator />

        <div className="grid w-full grid-cols-6 gap-2">
          <div className="col-span-4 flex items-center">
            <Typography>{ dueThisCycleText }</Typography>
          </div>
          <div className="col-span-2 flex justify-end text-wrap">
            <Typography>
              { subscription.dueCostThisCycle === null ? 'No bills due' : usdFormatter.format(subscription.dueCostThisCycle ?? 0) } (
              { subscription.billDuesWithinTimeRange?.length ?? 0 })
            </Typography>
          </div>
        </div>

        <div className="grid w-full grid-cols-12 gap-2">
          <div className="col-span-4 flex items-center">
            <Typography>Due date:</Typography>
          </div>
          <div className="col-span-8 flex justify-end text-wrap">
            { (
              subscription.dueDateThisCycle === null ||
              subscription.nextDueDateForThisCycleBillDue === null ||
              subscription.nextDueDateForThisCycleBillDue === undefined
            ) ?
              <Typography>Not available</Typography>
            : <div className="flex flex-row items-center justify-end">
              <DateRelativeDisplay time={ subscription.dueDateThisCycle as any } largest={ 3 } updateInterval={ 60_000 } />
            </div>
            }
          </div>
        </div>

        <div className="grid w-full grid-cols-12 gap-2">
          <div className="col-span-6 flex items-center">
            <Typography>Paid / Reimbursed:</Typography>
          </div>
          <div className="col-span-6 flex justify-end text-wrap">
            { (
              subscription.dueDateThisCycle === null ||
              subscription.nextDueDateForThisCycleBillDue === null ||
              subscription.nextDueDateForThisCycleBillDue === undefined
            ) ?
              <Typography>Not available</Typography>
            : <div className="flex flex-row items-center justify-end">
              <BillsTableTogglePaidButton
                  isPaid={ subscription.nextDueDateForThisCycleBillDue.paid }
                  billDueId={ subscription.nextDueDateForThisCycleBillDue.id }
                  subscriptionId={ subscription.id }
                  btnClassName="size-8"
                  btnIconClassName="size-6"
                  favoriteEntityId={ favoriteEntity.id }
                />
              <BillsTableToggleReimbursedButton
                  isReimbursed={ subscription.nextDueDateForThisCycleBillDue.reimbursed }
                  billDueId={ subscription.nextDueDateForThisCycleBillDue.id }
                  subscriptionId={ subscription.id }
                  btnClassName="size-8"
                  btnIconClassName="size-6"
                  favoriteEntityId={ favoriteEntity.id }
                />
            </div>
            }
          </div>
        </div>
      </div>
    );
  }

  if (favoriteEntity.entityType === 'BILL_DUE') {
    return <div className="flex w-full flex-col items-start justify-start gap-y-2"></div>;
  }

  return <div>Unknown entity type</div>;
}
