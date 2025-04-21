import Link from 'next/link';

import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';

import NavHeaderLogo from './NavHeaderLogo';
import NavHeaderText from './NavHeaderText';

export default function NavHeader() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" asChild>
          <Link href={ `/` } className="flex w-full flex-row items-center gap-2">
            <NavHeaderLogo />
            <NavHeaderText />
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
