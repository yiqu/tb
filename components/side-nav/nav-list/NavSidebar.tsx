import { SidebarCollapsableState } from '@/models/Sidebar.models';
import BillsGroup from '@/components/sidebar/bills-group/BillsGroup';
import { HomeGroup } from '@/components/sidebar/home-group/HomeGroup';
import { AddNewGroup } from '@/components/sidebar/add-group/AddNewGroup';
import { QueryGroup } from '@/components/sidebar/search-group/SearchGroup';
import { getSidebarCollapsableState } from '@/components/sidebar/utils/sidebar-cookies';
import { QuickAccessGroup } from '@/components/sidebar/quick-access-group/QuickAccessGroup';
import { Sidebar, SidebarFooter, SidebarHeader, SidebarContent } from '@/components/ui/sidebar';
import { OutstandingBillsGroup } from '@/components/sidebar/outstanding-group/OutstandingBillsGroup';

import NavHeader from '../header/NavHeader';
import { NavFooter } from '../footer/NavFooter';

export async function NavSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const sidebarCollapsableState: SidebarCollapsableState = await getSidebarCollapsableState();
  return (
    <Sidebar collapsible="icon" { ...props } id="app-sidebar">
      <SidebarHeader>
        <NavHeader />
      </SidebarHeader>
      <SidebarContent className="gap-0">
        <HomeGroup />
        <OutstandingBillsGroup />
        <BillsGroup />
        <QueryGroup />
        <AddNewGroup collapsableState={ sidebarCollapsableState } />
        <QuickAccessGroup collapsableState={ sidebarCollapsableState } />
      </SidebarContent>
      <SidebarFooter>
        <NavFooter />
      </SidebarFooter>
    </Sidebar>
  );
}
