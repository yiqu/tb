import { SidebarCollapsableState } from '@/models/Sidebar.models';
import { NavItemSearch } from '@/components/sidebar/query-section/NavItemSearch';
import NavItemAddNewBoba from '@/components/sidebar/add-section/NavItemAddNewBoba';
import { getSidebarCollapsableState } from '@/components/sidebar/utils/sidebar-cookies';
import NavSectionQuickAccess from '@/components/sidebar/quick-access-section/NavSectionQuickAccess';
import {
  Sidebar,
  SidebarRail,
  SidebarGroup,
  SidebarFooter,
  SidebarHeader,
  SidebarContent,
} from '@/components/ui/sidebar';

import NavHeader from '../header/NavHeader';
import { NavFooter } from '../footer/NavFooter';

export async function NavSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const sidebarCollapsableState: SidebarCollapsableState = await getSidebarCollapsableState();

  return (
    <Sidebar collapsible="icon" { ...props }>
      <SidebarHeader>
        <NavHeader />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="app-sidebar-group">
          <NavItemSearch />
          <div className="my-1"></div>
          <NavItemAddNewBoba />
          <div className="my-1"></div>
          <NavSectionQuickAccess collapsableState={ sidebarCollapsableState } />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavFooter />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
