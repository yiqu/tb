import { Suspense } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import BillsGroup from '@/components/sidebar/bills-group/BillsGroup';
import { HomeGroup } from '@/components/sidebar/home-group/HomeGroup';
import { AddNewGroup } from '@/components/sidebar/add-group/AddNewGroup';
import { QueryGroup } from '@/components/sidebar/search-group/SearchGroup';
import { QuickAccessGroup } from '@/components/sidebar/quick-access-group/QuickAccessGroup';
import SubscriptionsGroup from '@/components/sidebar/subscriptions-group/SubscriptionsGroup';
import { OutstandingBillsGroup } from '@/components/sidebar/outstanding-group/OutstandingBillsGroup';
import {
  Sidebar,
  SidebarMenu,
  SidebarGroup,
  SidebarFooter,
  SidebarHeader,
  SidebarContent,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';

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
        <SubscriptionsGroup />
        <QueryGroup />
        <Suspense fallback={ <NavSidebarSuspended title="New" /> }>
          <AddNewGroup />
        </Suspense>
        <Suspense fallback={ <NavSidebarSuspended title="Quick Access" /> }>
          <QuickAccessGroup />
        </Suspense>
      </SidebarContent>
      <SidebarFooter>
        <NavFooter />
      </SidebarFooter>
    </Sidebar>
  );
}

function NavSidebarSuspended({ title }: { title: string }) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{ title }</SidebarGroupLabel>
      <SidebarMenu className="app-sidebar-menu gap-2">
        <Skeleton className="relative left-2 h-32 w-[90%] rounded-xs" />
      </SidebarMenu>
    </SidebarGroup>
  );
}
