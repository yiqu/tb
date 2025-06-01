import ThemeToggleButton from './ThemeToggleButton';
import TopNavWelcomeButton from './TopNavWelcomeButton';
import ResourcesDropdownMenuButton from './ResourcesDropdownMenuButton';

export default function TopNavRightActionButtons() {
  return (
    <div className="flex flex-row items-center justify-end gap-x-2 px-4">
      <TopNavWelcomeButton />
      <ResourcesDropdownMenuButton />
      <ThemeToggleButton />
    </div>
  );
}
