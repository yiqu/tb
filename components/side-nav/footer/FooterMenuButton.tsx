/* eslint-disable readable-tailwind/multiline */
import { ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { SidebarMenuButton } from '@/components/ui/sidebar';
import { DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

import FooterAvatarLogo from './FooterAvatarLogo';
import FooterAvatarText from './FooterAvatarText';

export function FooterMenuButton() {
  return (
    <DropdownMenuTrigger asChild>
      <SidebarMenuButton
        size="lg"
        className={ cn(
          `cursor-pointer data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground`,
        ) }
      >
        <FooterAvatarLogo />
        <FooterAvatarText />
        <ChevronsUpDown className="ml-auto size-4" />
      </SidebarMenuButton>
    </DropdownMenuTrigger>
  );
}
