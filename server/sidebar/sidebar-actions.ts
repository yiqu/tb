'use server';

import { cookies } from 'next/headers';

import { safeParseJson } from '@/lib/utils';
import { SidebarCollapsableState } from '@/models/Sidebar.models';
import {
  SIDEBAR_COLLAPSABLE_HISTORY,
  SIDEBAR_COLLAPSABLE_FAVORITES,
  SIDEBAR_COLLAPSABLE_STATE_KEY,
} from '@/constants/constants';

const SIDEBAR_COLLAPSABLE_STATE_DEFAULT: SidebarCollapsableState = {
  [SIDEBAR_COLLAPSABLE_FAVORITES]: false,
  [SIDEBAR_COLLAPSABLE_HISTORY]: false,
};

export async function setSidebarCollapsableStateAction(stateKey: string, stateValue: boolean) {
  //delay
  //await new Promise((resolve) => setTimeout(resolve, 2000));

  const cookieStore = await cookies();
  const cookie = cookieStore.get(SIDEBAR_COLLAPSABLE_STATE_KEY);
  let state = SIDEBAR_COLLAPSABLE_STATE_DEFAULT;

  if (cookie) {
    state = safeParseJson<SidebarCollapsableState>(cookie.value, SIDEBAR_COLLAPSABLE_STATE_DEFAULT);
  }

  state[stateKey] = stateValue;
  cookieStore.set(SIDEBAR_COLLAPSABLE_STATE_KEY, JSON.stringify(state));

  return {
    [stateKey]: stateValue,
    success: true,
  };
}
