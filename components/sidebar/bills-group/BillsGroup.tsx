import Link from 'next/link';
import { Calendar } from 'lucide-react';

import { SidebarMenu, SidebarGroup, SidebarMenuItem, SidebarGroupLabel } from '@/components/ui/sidebar';

import SidebarMenuButtonParentWithActive from '../SidebarMenuButtonParentWithActive';

export default function BillsGroup() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Bills</SidebarGroupLabel>
      <SidebarMenu className="app-sidebar-menu gap-2">
        <SidebarMenuItem>
          <SidebarMenuButtonParentWithActive url="bills" tooltip="Bills">
            <Link href={ `/bills` } prefetch={ true }>
              <Calendar />
              <span>{ 'Bills' }</span>
            </Link>
          </SidebarMenuButtonParentWithActive>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
