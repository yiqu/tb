import AccountLeftNavAvatar from './AccountLeftNavAvatar';
import KeyboardShortcutsDisplay from './KeyboardShortcutsDisplay';
import AccountAchievementsParent from './AccountAchievementsParent';
import AccountLocalstorageSizeInfo from './AccountLocalstorageSizeInfo';
import AccountLeftNavNameDisplayWrapper from './AccountLeftNavNameDisplayWrapper';
import AccountLeftNavIsAdminDisplayWrapper from './AccountLeftNavIsAdminDisplayWrapper';

export default function AccountLeftNav() {
  return (
    <div className="flex w-full flex-col items-center justify-start gap-y-6">
      <AccountLeftNavAvatar />
      <div className="flex w-full flex-col items-center justify-start gap-y-2">
        <AccountLeftNavNameDisplayWrapper />
        <AccountLeftNavIsAdminDisplayWrapper />
      </div>
      <AccountLocalstorageSizeInfo />
      <AccountAchievementsParent />
      <KeyboardShortcutsDisplay />
    </div>
  );
}
