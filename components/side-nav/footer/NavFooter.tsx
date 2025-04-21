import { DropdownMenu } from '@/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuItem } from '@/components/ui/sidebar';

import FooterMenuContent from './FooterMenuContent';
import { FooterMenuButton } from './FooterMenuButton';

export function NavFooter() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <FooterMenuButton />
          <FooterMenuContent />
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
