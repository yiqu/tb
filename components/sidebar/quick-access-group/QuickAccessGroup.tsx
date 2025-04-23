import { SidebarCollapsableState } from '@/models/Sidebar.models';
import { SidebarMenu, SidebarGroup, SidebarGroupLabel } from '@/components/ui/sidebar';

import HistoryParentItem from './HistoryParentItem';
import FavoriteParentItem from './FavoriteParentItem';

export function QuickAccessGroup({ collapsableState }: { collapsableState: SidebarCollapsableState }) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Quick Access</SidebarGroupLabel>
      <SidebarMenu className="app-sidebar-menu gap-2">
        <FavoriteParentItem collapsableState={ collapsableState } />
        <HistoryParentItem collapsableState={ collapsableState } />
      </SidebarMenu>
    </SidebarGroup>
  );
}
