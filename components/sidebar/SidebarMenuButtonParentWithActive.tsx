'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { SidebarMenuButton, sidebarMenuButtonVariants } from '@/components/ui/sidebar';

export default function SidebarMenuButtonParentWithActive({
  tooltip,
  url,
  children,
  className,
}: { tooltip?: string; url: string; children: ReactNode; className?: string } & VariantProps<typeof sidebarMenuButtonVariants>) {
  const pathname = usePathname();
  const firstPath = pathname.split('/')[1] || '';
  const isActive = firstPath.toLowerCase() === url.toLowerCase();

  return (
    <SidebarMenuButton asChild tooltip={ tooltip } isActive={ isActive } className={ cn(className) }>
      { children }
    </SidebarMenuButton>
  );
}
