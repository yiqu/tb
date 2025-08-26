import Link from 'next/link';

import { TabsList, TabsTrigger } from '@/components/ui/tabs';

import { AccountTabListItem } from './account.utils';
import AccountContentTabsListTabs from './AccountContentTabsListTabs';

export default function AccountContentTabsListHeader() {
  return (
    <AccountContentTabsListTabs>
      <TabsList className={ `grid w-full grid-cols-5` }>
        { TAB_OPTIONS.map((tab: AccountTabListItem) => {
          return (
            <TabsTrigger key={ tab.id } value={ tab.url } asChild>
              <Link href={ `/account${tab.url}` } prefetch={ true }>
                { tab.displayText }
              </Link>
            </TabsTrigger>
          );
        }) }
      </TabsList>
    </AccountContentTabsListTabs>
  );
}

const TAB_OPTIONS: AccountTabListItem[] = [
  {
    id: 'general',
    displayText: 'General',
    url: '',
  },
  {
    id: 'personal-info',
    displayText: 'Personal Info',
    url: '/personal-info',
  },
  {
    id: 'settings',
    displayText: 'Settings',
    url: '/settings',
  },
  {
    id: 'security',
    displayText: 'Security',
    url: '/security',
  },
  {
    id: 'fun',
    displayText: 'Fun',
    url: '/fun',
  },
];
