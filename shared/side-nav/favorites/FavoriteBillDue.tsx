import { FavoriteEntity } from '@/models/favorites/favorite.model';

interface Props {
  favorite: FavoriteEntity;
}

export default function FavoriteBillDue({ favorite }: Props) {
  return <div>{ favorite.name }</div>;
}
