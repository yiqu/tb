import { AppFont } from '@/models/settings/general-settings.models';
import { getSettingsApplicationFont } from '@/server/settings/vibe-select';

import AccountGeneralVibeFontContent from './AccountGeneralVibeFontContent';

export default async function AccountGeneralVibeFontWrapper() {
  const font: AppFont = (await getSettingsApplicationFont()) as AppFont;

  return <AccountGeneralVibeFontContent font={ font } />;
}
