import Link from 'next/link';
import { Suspense } from 'react';
import { ClockAlert, CalendarArrowUp } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { SidebarMenu, SidebarGroup, SidebarMenuItem, SidebarGroupLabel } from '@/components/ui/sidebar';

import OutstandingBillsGroupBadge from './OutstandingBillsGroupBadge';
import SidebarMenuButtonParentWithActive from '../SidebarMenuButtonParentWithActive';

export function OutstandingBillsGroup() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Attention</SidebarGroupLabel>
      <SidebarMenu className="app-sidebar-menu gap-2">
        <SidebarMenuItem className="overflow-visible">
          <SidebarMenuButtonParentWithActive url="outstanding" tooltip="Outstanding Bills" className="overflow-visible">
            <Link href={ `/outstanding` } prefetch={ true } className="overflow-visible">
              <ClockAlert />
              <span>Outstanding Bills</span>
              <Suspense fallback={ <BadgeLoading /> }>
                <OutstandingBillsGroupBadge />
              </Suspense>
            </Link>
          </SidebarMenuButtonParentWithActive>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButtonParentWithActive url="upcoming" tooltip="Upcoming Bills">
            <Link href={ `/upcoming` } prefetch={ true }>
              <CalendarArrowUp />
              <span>{ 'Upcoming Bills' }</span>
            </Link>
          </SidebarMenuButtonParentWithActive>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}

function BadgeLoading() {
  return (
    <Badge className="relative bottom-3 -ml-2 rounded-full" variant="secondary">
      <Skeleton className="h-[21px] w-4 bg-transparent" />
    </Badge>
  );
}
