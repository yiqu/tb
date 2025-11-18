import ApiStatusButton from './ApiStatusButton';
import TopNavWelcomeButton from './TopNavWelcomeButton';
import ThemeToggleButtonParent from './ThemeToggleButtonParent';
import ResourcesDropdownMenuButton from './ResourcesDropdownMenuButton';

export default function TopNavRightActionButtons() {
  return (
    <div className="flex flex-row items-center justify-end gap-x-2 px-4">
      <ApiStatusButton />
      <TopNavWelcomeButton />
      <ResourcesDropdownMenuButton />
      <ThemeToggleButtonParent />
    </div>
  );
}
