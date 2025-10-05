import WithTooltip from '@/shared/components/WithTooltip';
import Typography from '@/components/typography/Typography';
import { FavoriteEntityResponseType } from '@/models/favorites/favorite.model';
import { getIsFavoriteByEntityTypeAndIdCached } from '@/server/favorites/favorites.server';

export default async function SubscriptionDetailsHeaderFavoriteName({ subscriptionId }: { subscriptionId: string }) {
  const favoriteName: FavoriteEntityResponseType | null = await getIsFavoriteByEntityTypeAndIdCached('SUBSCRIPTION', subscriptionId);

  if (!favoriteName) {
    return null;
  }

  return (
    <WithTooltip tooltip={ `Added as favorite: ${favoriteName.name}` }>
      <Typography variant="h3">({ favoriteName.name })</Typography>
    </WithTooltip>
  );
}
