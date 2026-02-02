import { useQuery } from '@tanstack/react-query';

import { Skeleton } from '@/components/ui/skeleton';
import { getParamsAsObject } from '@/lib/url.utils';
import { getUSDFormatter } from '@/lib/number.utils';
import Typography from '@/components/typography/Typography';
import { FavoriteEntity } from '@/models/favorites/favorite.model';
import DateRelativeDisplay from '@/shared/table/DateRelativeDisplay';
import { getBillDueByIdQueryOptions } from '@/server/bills/query/bills.query';
import { getSubscriptionsQueryOptions } from '@/server/subscriptions/query/subscription.query';

const usdFormatter = getUSDFormatter();

export default function FavoriteItemName({ favoriteEntity }: { favoriteEntity: FavoriteEntity }) {
  // Extract query section from name (format: "name?query=params")
  const nameArray = favoriteEntity.name.split('?');
  const querySection = nameArray[1] ?? favoriteEntity.name;
  const urlSearchParamsObject = getParamsAsObject(new URLSearchParams(querySection));
  const isSearchParamsOnlySubscriptions: boolean = !!(
    Object.keys(urlSearchParamsObject).length === 1 && urlSearchParamsObject.subscriptions
  );
  
  // Extract subscription IDs if this is a search query with only subscriptions parameter
  let subscriptionIds: string[] = [];
  if (favoriteEntity.entityType === 'SEARCH_QUERY' && favoriteEntity.name.includes('subscriptions=') && isSearchParamsOnlySubscriptions) {
    const subIdsSection = decodeURIComponent(querySection.split('=')[1] ?? '');
    subscriptionIds = subIdsSection.split(',');
  }

  const {
    data: billDue,
    isLoading: isBillDueLoading,
    isError: isBillDueError,
  } = useQuery({
    ...getBillDueByIdQueryOptions(favoriteEntity.entityType === 'BILL_DUE' ? (favoriteEntity.billDueId ?? '') : ''),
    enabled: favoriteEntity.entityType === 'BILL_DUE' && !!favoriteEntity.billDueId,
  });

  const {
    data: subscriptionsData,
    isLoading: isSubscriptionsDataLoading,
    isError: isSubscriptionsDataError,
  } = useQuery({
    ...getSubscriptionsQueryOptions(subscriptionIds),
    enabled: favoriteEntity.entityType === 'SEARCH_QUERY' && subscriptionIds.length > 0,
  });

  if (favoriteEntity.entityType === 'SEARCH_QUERY') {
    if (isSubscriptionsDataLoading) {
      return <Skeleton className="h-5 w-full truncate" />;
    }
    if (isSubscriptionsDataError) {
      return <Typography className="truncate text-red-500">Error loading subscriptions</Typography>;
    }

    if (isSearchParamsOnlySubscriptions) {
      const subscriptionNames = (subscriptionsData ?? []).map((subscription) => subscription.name).join(', ');
      return <Typography className="truncate">{ subscriptionNames }</Typography>;
    }

    return <Typography className="truncate">{ querySection }</Typography>;
  }

  if (favoriteEntity.entityType === 'SUBSCRIPTION') {
    return <Typography className="truncate">{ favoriteEntity.name }</Typography>;
  }

  if (favoriteEntity.entityType === 'BILL_DUE') {
    const dueDate: string | undefined = billDue?.dueDate;
    const subscriptionName: string | undefined = billDue?.subscription.name;
    const cost: number | undefined = billDue?.cost ?? billDue?.subscription.cost;

    if (isBillDueLoading) {
      return <Skeleton className="h-5 w-full truncate" />;
    }
    if (isBillDueError) {
      return <Typography className="truncate text-red-500">Error loading bill due</Typography>;
    }

    return (
      <div className="flex w-full flex-row items-center justify-start gap-x-1 truncate">
        <Typography className="">{ usdFormatter.format(cost ?? 0) } |</Typography>
        <Typography className="truncate">{ subscriptionName } |</Typography>
        <DateRelativeDisplay
          time={ dueDate ?? null }
          largest={ 1 }
          updateInterval={ 120_000 }
          useShortText={ true }
          className="truncate"
          overrideHideSeconds
        />
      </div>
    );
  }

  return (
    <div>
      <Typography>{ favoriteEntity.name }</Typography>
    </div>
  );
}
