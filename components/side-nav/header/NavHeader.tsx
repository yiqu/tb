import Link from 'next/link';

import FestiveLeftNavHeaderLogo from '@/shared/components/FestiveLeftNavHeaderLogo';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';

import NavHeaderText from './NavHeaderText';

export default function NavHeader() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" asChild>
          <Link href={ `/` } className="flex w-full flex-row items-center gap-2">
            <FestiveLeftNavHeaderLogo />
            <NavHeaderText />
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
