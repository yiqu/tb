import { Suspense } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import BillsGroup from '@/components/sidebar/bills-group/BillsGroup';
import { HomeGroup } from '@/components/sidebar/home-group/HomeGroup';
import { AddNewGroup } from '@/components/sidebar/add-group/AddNewGroup';
import { QueryGroup } from '@/components/sidebar/search-group/SearchGroup';
import { QuickAccessGroup } from '@/components/sidebar/quick-access-group/QuickAccessGroup';
import { Sidebar, SidebarFooter, SidebarHeader, SidebarContent } from '@/components/ui/sidebar';
import { OutstandingBillsGroup } from '@/components/sidebar/outstanding-group/OutstandingBillsGroup';

import NavHeader from '../header/NavHeader';
import { NavFooter } from '../footer/NavFooter';

export async function NavSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
        <Suspense fallback={ <NavSidebarSuspended /> }>
          <AddNewGroup />
        </Suspense>
        <Suspense fallback={ <NavSidebarSuspended /> }>
          <QuickAccessGroup />
        </Suspense>
      </SidebarContent>
      <SidebarFooter>
        <NavFooter />
      </SidebarFooter>
    </Sidebar>
  );
}

function NavSidebarSuspended() {
  return <Skeleton className="relative left-4 h-32 w-[90%] rounded-xs" />;
}
