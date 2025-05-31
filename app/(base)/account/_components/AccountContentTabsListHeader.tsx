import Link from 'next/link';

import { TabListItem } from '@/models/NavItem.models';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';

import AccountContentTabsListTabs from './AccountContentTabsListTabs';

export default function AccountContentTabsListHeader() {
  return (
    <AccountContentTabsListTabs>
      <TabsList className={ `grid w-full grid-cols-4` }>
        { TAB_OPTIONS.map((tab: TabListItem) => {
          return (
            <TabsTrigger key={ tab.id } value={ tab.url } asChild>
              <Link href={ `/account${tab.url}` }>{ tab.displayText }</Link>
            </TabsTrigger>
          );
        }) }
      </TabsList>
    </AccountContentTabsListTabs>
  );
}

const TAB_OPTIONS: TabListItem[] = [
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
];
