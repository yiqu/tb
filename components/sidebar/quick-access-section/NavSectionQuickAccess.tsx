'use client';

import useSideBarState from '@/hooks/useSideBarState';
import { SidebarGroupLabel } from '@/components/ui/sidebar';
import { SidebarCollapsableState } from '@/models/Sidebar.models';
import { SIDEBAR_COLLAPSABLE_HISTORY, SIDEBAR_COLLAPSABLE_FAVORITES } from '@/constants/constants';

import { NavItemHistory } from '../history-section/NavItemHistory';
import { NavItemFavorites } from '../favorites-section/NavItemFavorites';

export default function NavSectionQuickAccess({ collapsableState }: { collapsableState: SidebarCollapsableState }) {
  const { isSidebarCollapsed } = useSideBarState();

  return (
    <>
      { !isSidebarCollapsed ?
        <SidebarGroupLabel>Quick Access</SidebarGroupLabel>
      : null }
      <NavItemFavorites isCollapsed={ collapsableState[SIDEBAR_COLLAPSABLE_FAVORITES] } />
      <div className="my-1"></div>
      <NavItemHistory isCollapsed={ collapsableState[SIDEBAR_COLLAPSABLE_HISTORY] } />
      <div className="my-1"></div>
    </>
  );
}
