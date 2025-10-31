import { getAllFavoritesCached } from '@/server/favorites/favorites.server';

export default function PreloadFunctionForApplication() {
  preloadFavorites();
  return null;
}

const preloadFavorites = () => {
  void getAllFavoritesCached();
};
