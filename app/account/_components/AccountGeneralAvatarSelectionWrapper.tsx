import { getSettingsUpdateAvatarImage } from '@/server/settings/user-avatar';

import AccountGeneralAvatarSelection from './AccountGeneralAvatarSelection';

export default async function AccountGeneralAvatarSelectionWrapper() {
  const avatarId: string = await getSettingsUpdateAvatarImage();

  return <AccountGeneralAvatarSelection avatarId={ avatarId } />;
}
