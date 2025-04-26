import { Suspense } from 'react';

import AccountContentTabsListHeader from './AccountContentTabsListHeader';

export default function AccountContentTabsParent({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full w-full">
      <Suspense>
        <AccountContentTabsListHeader />
      </Suspense>
      { children }
    </div>
  );
}
