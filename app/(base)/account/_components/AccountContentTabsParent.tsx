import AccountContentTabsListHeader from './AccountContentTabsListHeader';

export default function AccountContentTabsParent({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full w-full flex-col gap-y-6" id="account-content-tabs-parent">
      <AccountContentTabsListHeader />

      { children }
    </div>
  );
}
