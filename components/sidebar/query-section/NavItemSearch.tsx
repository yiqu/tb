import { LeftNavItem } from '@/models/NavItem.models';
import { SidebarMenu, SidebarMenuItem, SidebarGroupLabel } from '@/components/ui/sidebar';

import MenuButton from '../MenuButton';

const ITEMS: LeftNavItem[] = [
  {
    name: 'Search',
    url: 'search',
    tooltip: 'Search',
  },
];

export function NavItemSearch() {
  return (
    <>
      <SidebarGroupLabel>Query</SidebarGroupLabel>
      <SidebarMenu className="app-sidebar-menu gap-2">
        { ITEMS.map((item) => (
          <SidebarMenuItem key={ item.name }>
            <MenuButton item={ item } />
          </SidebarMenuItem>
        )) }
      </SidebarMenu>
    </>
  );
}
