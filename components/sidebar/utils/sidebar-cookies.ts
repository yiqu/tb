import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies';

import { safeParseJson } from '@/lib/utils';
import { SidebarCollapsableState } from '@/models/Sidebar.models';
import { setCookie, deleteCookie, getCookieByName } from '@/lib/cookies';
import {
  SIDEBAR_COLLAPSABLE_HISTORY,
  SIDEBAR_COLLAPSABLE_FAVORITES,
  SIDEBAR_COLLAPSABLE_STATE_KEY,
} from '@/constants/constants';

export const SIDEBAR_COLLAPSABLE_STATE_DEFAULT: SidebarCollapsableState = {
  [SIDEBAR_COLLAPSABLE_FAVORITES]: false,
  [SIDEBAR_COLLAPSABLE_HISTORY]: false,
};

export async function getSidebarCollapsableState(): Promise<SidebarCollapsableState> {
  const cookie: RequestCookie | undefined = await getCookieByName(SIDEBAR_COLLAPSABLE_STATE_KEY);

  if (!cookie) {
    return SIDEBAR_COLLAPSABLE_STATE_DEFAULT;
  }
  return safeParseJson<SidebarCollapsableState>(cookie.value, SIDEBAR_COLLAPSABLE_STATE_DEFAULT);
}

export async function setSidebarCollapsableState(
  stateKey: typeof SIDEBAR_COLLAPSABLE_FAVORITES | typeof SIDEBAR_COLLAPSABLE_HISTORY,
  stateValue: boolean,
) {
  const state: SidebarCollapsableState = await getSidebarCollapsableState();
  state[stateKey] = stateValue;
  await setCookie(SIDEBAR_COLLAPSABLE_STATE_KEY, JSON.stringify(state));
}

export async function deleteSidebarCollapsableState() {
  await deleteCookie(SIDEBAR_COLLAPSABLE_STATE_KEY);
}
