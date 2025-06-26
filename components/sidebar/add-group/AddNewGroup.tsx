import { SidebarCollapsableState } from '@/models/Sidebar.models';
import { SidebarMenu, SidebarGroup, SidebarGroupLabel } from '@/components/ui/sidebar';

import AddNewParentItem from './AddNewParentItem';
import { getSidebarCollapsableState } from '../utils/sidebar-cookies';

export async function AddNewGroup() {
  const sidebarCollapsableState: SidebarCollapsableState = await getSidebarCollapsableState();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>New</SidebarGroupLabel>
      <SidebarMenu className="app-sidebar-menu gap-2">
        <AddNewParentItem collapsableState={ sidebarCollapsableState } />
      </SidebarMenu>
    </SidebarGroup>
  );
}
