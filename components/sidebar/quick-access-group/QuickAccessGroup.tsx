import { SidebarCollapsableState } from '@/models/Sidebar.models';
import { SidebarMenu, SidebarGroup, SidebarGroupLabel } from '@/components/ui/sidebar';

import HistoryParentItem from './HistoryParentItem';
import FavoriteParentItem from './FavoriteParentItem';
import { getSidebarCollapsableState } from '../utils/sidebar-cookies';

export async function QuickAccessGroup() {
  const sidebarCollapsableState: SidebarCollapsableState = await getSidebarCollapsableState();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Quick Access</SidebarGroupLabel>
      <SidebarMenu className="app-sidebar-menu gap-2">
        <FavoriteParentItem collapsableState={ sidebarCollapsableState } />
        <HistoryParentItem collapsableState={ sidebarCollapsableState } />
      </SidebarMenu>
    </SidebarGroup>
  );
}
