'use client';

import { usePathname } from 'next/navigation';

import { Tabs } from '@/components/ui/tabs';

interface AccountContentTabsListTabsProps {
  children: React.ReactNode;
}

export default function AccountContentTabsListTabs({ children }: AccountContentTabsListTabsProps) {
  const pathName = usePathname();
  const pathNameArray = pathName.split('/account');
  const tabValue = pathNameArray[pathNameArray.length - 1];

  return (
    <Tabs value={ tabValue } className="w-full">
      { children }
    </Tabs>
  );
}
