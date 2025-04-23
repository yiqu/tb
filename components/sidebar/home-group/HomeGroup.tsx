import Link from 'next/link';
import { LayoutDashboard } from 'lucide-react';

import { SidebarMenu, SidebarGroup, SidebarMenuItem, SidebarGroupLabel } from '@/components/ui/sidebar';

import SidebarMenuButtonParentWithActive from '../SidebarMenuButtonParentWithActive';

export function HomeGroup() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Home</SidebarGroupLabel>
      <SidebarMenu className="app-sidebar-menu gap-2">
        <SidebarMenuItem>
          <SidebarMenuButtonParentWithActive url="" tooltip="Dashboard">
            <Link href={ `/` } prefetch={ true }>
              <LayoutDashboard />
              <span>{ 'Dashboard' }</span>
            </Link>
          </SidebarMenuButtonParentWithActive>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
