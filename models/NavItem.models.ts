import { type LucideIcon } from 'lucide-react';

import {
  SIDEBAR_COLLAPSABLE_HISTORY,
  SIDEBAR_COLLAPSABLE_ADD_NEW,
  SIDEBAR_COLLAPSABLE_FAVORITES,
} from '@/constants/constants';

export interface LeftNavItem {
  name: string;
  tooltip?: string;
  url: string;
  icon?: LucideIcon;
}

export interface NestNavListItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: LinkItem[];
  collapsableStateCookieKey?:
    | typeof SIDEBAR_COLLAPSABLE_FAVORITES
    | typeof SIDEBAR_COLLAPSABLE_HISTORY
    | typeof SIDEBAR_COLLAPSABLE_ADD_NEW;
}

export interface LinkItem {
  name: string;
  url: string;
}

export type TabListItem = {
  id: string;
  displayText: string;
  url: string;
}