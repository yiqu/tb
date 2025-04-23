'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { VariantProps } from 'class-variance-authority';

import { SidebarMenuButton, sidebarMenuButtonVariants } from '@/components/ui/sidebar';

export default function SidebarMenuButtonParentWithActive({
  tooltip,
  url,
  children,
}: { tooltip?: string; url: string; children: ReactNode } & VariantProps<typeof sidebarMenuButtonVariants>) {
  const pathname = usePathname();
  const firstPath = pathname.split('/')[1] || '';
  const isActive = firstPath.toLowerCase() === url.toLowerCase();

  return (
    <SidebarMenuButton asChild tooltip={ tooltip } isActive={ isActive }>
      { children }
    </SidebarMenuButton>
  );
}
