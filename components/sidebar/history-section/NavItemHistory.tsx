'use client';

import { History as HistoryIcon } from 'lucide-react';

import { SidebarMenu } from '@/components/ui/sidebar';
import { NestNavListItem } from '@/models/NavItem.models';
import { SIDEBAR_COLLAPSABLE_HISTORY } from '@/constants/constants';

import NavExpandableItem from '../NavExpandableItem';

const ITEMS: NestNavListItem[] = [
  {
    title: 'History',
    url: 'history',
    icon: HistoryIcon,
    collapsableStateCookieKey: SIDEBAR_COLLAPSABLE_HISTORY,
    items: [
      {
        name: 'Milk tea, Lg, less ice, boba, jelly',
        url: '/history',
      },
      {
        name: 'Mango tea, Lg, less ice, boba, jelly',
        url: '/history',
      },
    ],
  },
];

export function NavItemHistory({ isCollapsed }: { isCollapsed: boolean }) {
  return (
    <>
      <SidebarMenu className="gap-2">
        { ITEMS.map((item) => (
          <NavExpandableItem key={ item.title } item={ item } isCollapsed={ isCollapsed } />
        )) }
      </SidebarMenu>
    </>
  );
}
