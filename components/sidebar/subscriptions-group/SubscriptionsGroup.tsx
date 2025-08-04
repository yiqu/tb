import Link from 'next/link';
import { ReceiptText } from 'lucide-react';

import { SidebarMenu, SidebarGroup, SidebarMenuItem, SidebarGroupLabel } from '@/components/ui/sidebar';

import SidebarMenuButtonParentWithActive from '../SidebarMenuButtonParentWithActive';

export default function SubscriptionsGroup() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Subscriptions</SidebarGroupLabel>
      <SidebarMenu className="app-sidebar-menu gap-2">
        <SidebarMenuItem>
          <SidebarMenuButtonParentWithActive url="subscriptions" tooltip="Subscriptions">
            <Link href={ `/subscriptions` } prefetch={ true }>
              <ReceiptText />
              <span>{ 'Subscriptions' }</span>
            </Link>
          </SidebarMenuButtonParentWithActive>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
