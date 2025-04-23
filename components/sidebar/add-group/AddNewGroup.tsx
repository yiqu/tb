import { SidebarCollapsableState } from '@/models/Sidebar.models';
import { SidebarMenu, SidebarGroup, SidebarGroupLabel } from '@/components/ui/sidebar';

import AddNewParentItem from './AddNewParentItem';

export function AddNewGroup({ collapsableState }: { collapsableState: SidebarCollapsableState }) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>New</SidebarGroupLabel>
      <SidebarMenu className="app-sidebar-menu gap-2">
        <AddNewParentItem collapsableState={ collapsableState } />
      </SidebarMenu>
    </SidebarGroup>
  );
}
