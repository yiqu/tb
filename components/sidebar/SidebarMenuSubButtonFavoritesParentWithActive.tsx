'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { VariantProps } from 'class-variance-authority';

import { SidebarMenuSubButton, sidebarMenuButtonVariants } from '@/components/ui/sidebar';

export default function SidebarMenuSubButtonFavoritesParentWithActive({
  favoriteId,
  children,
}: { tooltip?: string; favoriteId: string; children: ReactNode } & VariantProps<typeof sidebarMenuButtonVariants>) {
  const pathname = usePathname();
  const firstPath = pathname.split('/')[3] || '';
  const accessType = pathname.split('/')[1] || '';
  const isActive = firstPath.toLowerCase() === favoriteId.toLowerCase() && accessType.toLowerCase() === 'favorites';

  return (
    <SidebarMenuSubButton asChild isActive={ isActive }>
      { children }
    </SidebarMenuSubButton>
  );
}
