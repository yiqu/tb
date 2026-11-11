import ApiStatusButton from './ApiStatusButton';
import TopNavWelcomeButton from './TopNavWelcomeButton';
import TopNavNotificationsButton from './TopNavNotificationsButton';
import ThemeAndMoreSettingsMenu from './ThemeAndMoreSettingsMenu';
import ResourcesDropdownMenuButton from './ResourcesDropdownMenuButton';

export default function TopNavRightActionButtons() {
  return (
    <div className="flex flex-row items-center justify-end gap-x-2 px-4">
      <ApiStatusButton />
      <TopNavWelcomeButton />
      <ResourcesDropdownMenuButton />
      <TopNavNotificationsButton />
      <ThemeAndMoreSettingsMenu />
    </div>
  );
}
