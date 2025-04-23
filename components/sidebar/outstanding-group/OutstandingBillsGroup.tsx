import Link from 'next/link';
import { ClockAlert, CalendarArrowUp } from 'lucide-react';

import { SidebarMenu, SidebarGroup, SidebarMenuItem, SidebarGroupLabel } from '@/components/ui/sidebar';

import SidebarMenuButtonParentWithActive from '../SidebarMenuButtonParentWithActive';

export function OutstandingBillsGroup() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Attention</SidebarGroupLabel>
      <SidebarMenu className="app-sidebar-menu gap-2">
        <SidebarMenuItem>
          <SidebarMenuButtonParentWithActive url="outstanding" tooltip="Outstanding Bills">
            <Link href={ `/outstanding` } prefetch={ true }>
              <ClockAlert />
              <span>{ 'Outstanding Bills' }</span>
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
