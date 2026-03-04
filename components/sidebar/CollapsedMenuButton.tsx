'use client';

import { usePathname } from 'next/navigation';
import { VariantProps } from 'class-variance-authority';

import Link from '@/shared/components/Link';
import { LeftNavItem } from '@/models/NavItem.models';
import { SidebarMenuButton, sidebarMenuButtonVariants } from '@/components/ui/sidebar';

import { SideBarLucideIcon } from './utils/SidebarUtils';

export default function CollapsedMenuButton({
  item,
  ...props
}: { item: LeftNavItem } & VariantProps<typeof sidebarMenuButtonVariants> & React.ComponentProps<'button'>) {
  const pathname = usePathname();
  const firstPath = pathname.split('/')[1] || '';
  const isActive = firstPath.toLowerCase() === item.url.toLowerCase();

  return (
    <SidebarMenuButton asChild isActive={ isActive } { ...props }>
      <Link href={ `/${item.url}` as any }>
        <SideBarLucideIcon url={ item.url } />
      </Link>
    </SidebarMenuButton>
  );
}
