import { getSettingsApplicationCompactMode } from '@/server/settings/app-settings';

import ThemeAndMoreCompactToggle from './ThemeAndMoreCompactToggle';

export default async function ThemeAndMoreCompactToggleParent() {
  const isCompactMode = await getSettingsApplicationCompactMode();

  return <ThemeAndMoreCompactToggle isCompactMode={ isCompactMode } />;
}
