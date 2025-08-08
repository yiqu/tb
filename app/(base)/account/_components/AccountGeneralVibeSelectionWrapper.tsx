import { AppVibe } from '@/models/settings/general-settings.models';
import { getSettingsApplicationVibe } from '@/server/settings/vibe-select';

import AccountGeneralVibeSelectionContent from './AccountGeneralVibeSelectionContent';

export default async function AccountGeneralVibeSelectionWrapper() {
  const vibe: AppVibe = (await getSettingsApplicationVibe()) as AppVibe;

  return <AccountGeneralVibeSelectionContent vibe={ vibe } />;
}
