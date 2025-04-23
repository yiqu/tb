'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { VariantProps } from 'class-variance-authority';

import { SidebarMenuSubButton, sidebarMenuButtonVariants } from '@/components/ui/sidebar';

export default function SidebarMenuSubButtonHistoryParentWithActive({
  historyId,
  children,
}: { tooltip?: string; historyId: string; children: ReactNode } & VariantProps<typeof sidebarMenuButtonVariants>) {
  const pathname = usePathname();
  const firstPath = pathname.split('/')[3] || '';
  const accessType = pathname.split('/')[1] || '';
  const isActive = firstPath.toLowerCase() === historyId.toLowerCase() && accessType.toLowerCase() === 'history';

  return (
    <SidebarMenuSubButton asChild isActive={ isActive }>
      { children }
    </SidebarMenuSubButton>
  );
}
