'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { VariantProps } from 'class-variance-authority';

import { SidebarMenuSubButton, sidebarMenuButtonVariants } from '@/components/ui/sidebar';

export default function SidebarMenuSubButtonParentWithActive({
  url,
  children,
}: { tooltip?: string; url: string; children: ReactNode } & VariantProps<typeof sidebarMenuButtonVariants>) {
  const pathname = usePathname();
  const firstPath = pathname.split('/')[2] || '';
  const isActive = firstPath.toLowerCase() === url.toLowerCase();

  return (
    <SidebarMenuSubButton asChild isActive={ isActive }>
      { children }
    </SidebarMenuSubButton>
  );
}
