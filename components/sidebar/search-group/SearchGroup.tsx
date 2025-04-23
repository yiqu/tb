import Link from 'next/link';
import { Search } from 'lucide-react';

import { SidebarMenu, SidebarGroup, SidebarMenuItem, SidebarGroupLabel } from '@/components/ui/sidebar';

import SidebarMenuButtonParentWithActive from '../SidebarMenuButtonParentWithActive';

export function QueryGroup() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Query</SidebarGroupLabel>
      <SidebarMenu className="app-sidebar-menu gap-2">
        <SidebarMenuItem>
          <SidebarMenuButtonParentWithActive url="search" tooltip="Search">
            <Link href={ `/search` } prefetch={ true }>
              <Search />
              <span>{ 'Search' }</span>
            </Link>
          </SidebarMenuButtonParentWithActive>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
