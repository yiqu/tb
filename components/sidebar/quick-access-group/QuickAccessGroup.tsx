import { SidebarCollapsableState } from '@/models/Sidebar.models';
import { FavoriteEntity } from '@/models/favorites/favorite.model';
import { getAllFavoritesCached } from '@/server/favorites/favorites.server';
import { SidebarMenu, SidebarGroup, SidebarGroupLabel } from '@/components/ui/sidebar';

import HistoryParentItem from './HistoryParentItem';
import FavoriteParentItem from './FavoriteParentItem';
import { getSidebarCollapsableState } from '../utils/sidebar-cookies';

export async function QuickAccessGroup() {
  const sidebarCollapsableState: SidebarCollapsableState = await getSidebarCollapsableState();
  const allFavoritesPromise: Promise<FavoriteEntity[]> = getAllFavoritesCached();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Quick Access</SidebarGroupLabel>
      <SidebarMenu className="app-sidebar-menu gap-2">
        <FavoriteParentItem collapsableState={ sidebarCollapsableState } allFavoritesPromise={ allFavoritesPromise } />
        <HistoryParentItem collapsableState={ sidebarCollapsableState } />
      </SidebarMenu>
    </SidebarGroup>
  );
}
