import { SidebarCollapsableState } from '@/models/Sidebar.models';
import { FavoriteEntity } from '@/models/favorites/favorite.model';
import { getAllFavoritesCached } from '@/server/favorites/favorites.server';
import { HistoryEntryResponse } from '@/models/history/history-entry.model';
import { getAllHistoryEntriesCached } from '@/server/history/history.server';
import { SidebarMenu, SidebarGroup, SidebarGroupLabel } from '@/components/ui/sidebar';

import HistoryParentItem from './HistoryParentItem';
import FavoriteParentItem from './FavoriteParentItem';
import { getSidebarCollapsableState } from '../utils/sidebar-cookies';

export async function QuickAccessGroup() {
  const sidebarCollapsableState: SidebarCollapsableState = await getSidebarCollapsableState();
  const allFavoritesPromise: Promise<FavoriteEntity[]> = getAllFavoritesCached();
  const allHistoryEntriesPromise: Promise<HistoryEntryResponse> = getAllHistoryEntriesCached();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Quick Access</SidebarGroupLabel>
      <SidebarMenu className="app-sidebar-menu gap-2">
        <FavoriteParentItem collapsableState={ sidebarCollapsableState } allFavoritesPromise={ allFavoritesPromise } />
        <HistoryParentItem collapsableState={ sidebarCollapsableState } allHistoryEntriesPromise={ allHistoryEntriesPromise } />
      </SidebarMenu>
    </SidebarGroup>
  );
}
