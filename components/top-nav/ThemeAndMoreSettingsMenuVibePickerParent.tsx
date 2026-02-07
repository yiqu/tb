import { AppVibe } from '@/models/settings/general-settings.models';
import { getSettingsApplicationVibe } from '@/server/settings/vibe-select';

import ThemeAndMoreSettingsMenuVibePicker from './ThemeAndMoreSettingsMenuVibePicker';

export default async function ThemeAndMoreSettingsMenuVibePickerParent() {
  const vibe: AppVibe = (await getSettingsApplicationVibe()) as AppVibe;

  return <ThemeAndMoreSettingsMenuVibePicker vibe={ vibe } />;
}
