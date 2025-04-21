'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { VariantProps } from 'class-variance-authority';

import { LeftNavItem } from '@/models/NavItem.models';
import { SidebarMenuButton, sidebarMenuButtonVariants } from '@/components/ui/sidebar';

import { SideBarLucideIcon } from './utils/SidebarUtils';

export default function MenuButton({ item }: { item: LeftNavItem } & VariantProps<typeof sidebarMenuButtonVariants>) {
  const pathname = usePathname();
  const firstPath = pathname.split('/')[1] || '';
  const isActive = firstPath.toLowerCase() === item.url.toLowerCase();

  return (
    <SidebarMenuButton asChild tooltip={ item.tooltip } isActive={ isActive }>
      <Link href={ `/${item.url}` } prefetch={ true }>
        <SideBarLucideIcon url={ item.url } />
        <span>{ item.name }</span>
      </Link>
    </SidebarMenuButton>
  );
}
