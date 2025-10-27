import Image from 'next/image';
import startCase from 'lodash/startCase';
import { useQuery } from '@tanstack/react-query';

import { Spinner } from '@/components/ui/spinner';
import { Skeleton } from '@/components/ui/skeleton';
import { BillDue } from '@/models/bills/bills.model';
import { Separator } from '@/components/ui/separator';
import Typography from '@/components/typography/Typography';
import SubscriptionLogo from '@/components/logos/SubscriptionLogo';
import EntityDisplayMedia from '@/shared/components/EntityDisplayMedia';
import { SubscriptionOriginal } from '@/models/subscriptions/subscriptions.model';
import { getFavoriteByIdQueryOptions } from '@/server/favorites/query/favorites.query';
import { getFrequencyImageUrl, getSubscriptionLogoSize } from '@/shared/table/table.utils';
import { FavoriteEntity, getFavoriteEntityEntityTypeLabel } from '@/models/favorites/favorite.model';

export default function FavoriteItemDetails({ favoriteEntity }: { favoriteEntity: FavoriteEntity }) {
  const {
    data: favoriteDetails,
    isLoading,
    isFetching,
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
        <FavoriteDetailsTitle favoriteEntity={ favoriteEntity } />
        { isFetching ?
          <Spinner className="size-4" />
        : null }
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

function FavoriteDetailsTitle({ favoriteEntity }: { favoriteEntity: FavoriteEntity }) {
  return (
    <div className="flex flex-row items-center justify-start gap-x-1">
      <EntityDisplayMedia entity={ favoriteEntity.entityType } />
      <Typography>{ getFavoriteEntityEntityTypeLabel(favoriteEntity.entityType) }</Typography>
    </div>
  );
}

function FavoriteDetailsContent({
  favoriteEntity,
  favoriteDetails,
}: {
  favoriteEntity: FavoriteEntity;
  favoriteDetails: SubscriptionOriginal | BillDue | null;
}) {
  if (!favoriteDetails) {
    return (
      <div className="flex flex-col items-start justify-start gap-y-2">
        <Typography>No favorite details found</Typography>
      </div>
    );
  }

  if (favoriteEntity.entityType === 'SUBSCRIPTION') {
    const subscription = favoriteDetails as SubscriptionOriginal;
    return (
      <div className="flex w-full flex-col items-start justify-start gap-y-2">
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
      </div>
    );
  }

  if (favoriteEntity.entityType === 'BILL_DUE') {
    return <div className="flex w-full flex-col items-start justify-start gap-y-2"></div>;
  }

  return <div>Unknown entity type</div>;
}
