import { ReactNode } from 'react';

import { isTrue } from '@/lib/utils';
import { getCookieByName } from '@/lib/cookies';
import { SIDE_NAV_STATE_COOKIE_NAME } from '@/constants/constants';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

import TopNav from '../top-nav/TopNav';
import TopNavWrapper from '../top-nav/TopNavWrapper';
import { NavSidebar } from '../side-nav/nav-list/NavSidebar';

export default async function AppLayout({ children }: { children: ReactNode }) {
  const sideNavState = await getCookieByName(SIDE_NAV_STATE_COOKIE_NAME);
  const isSideNavOpen = isTrue(sideNavState?.value);

  return (
    <SidebarProvider defaultOpen={ isSideNavOpen }>
      <NavSidebar />
      <SidebarInset>
        <TopNavWrapper>
          <TopNav />
        </TopNavWrapper>
        <main className="flex w-full flex-1 flex-col gap-4 p-4" id="main-content">
          { children }
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
