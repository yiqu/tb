import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { VariantProps } from 'class-variance-authority';

import { LeftNavItem } from '@/models/NavItem.models';
import { SidebarMenuButton, sidebarMenuButtonVariants } from '@/components/ui/sidebar';

import { SideBarLucideIcon } from './SidebarUtils';

export default function MenuButton({
  item,
  ...props
}: { item: LeftNavItem } & VariantProps<typeof sidebarMenuButtonVariants>) {
  const pathName = usePathname();
  const firstPath = pathName.split('/')[1] || '';
  const isActive = firstPath.toLowerCase() === item.url.toLowerCase();

  return (
    <SidebarMenuButton asChild tooltip={ item.tooltip } isActive={ isActive } { ...props }>
      <Link href={ `/${item.url}` } prefetch>
        <SideBarLucideIcon url={ item.url } />
        <span>{ item.name }</span>
      </Link>
    </SidebarMenuButton>
  );
}
