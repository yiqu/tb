import { ReactNode } from 'react';

import { getSettingsApplicationFont, getSettingsApplicationVibe } from '@/server/settings/vibe-select';

import VibeProvider from './VibeProvider';

export default async function VibeProviderWrapper({ children }: { children: ReactNode }) {
  const [vibe, fontOverride] = await Promise.all([getSettingsApplicationVibe(), getSettingsApplicationFont()]);

  return (
    <VibeProvider vibe={ vibe } fontOverride={ fontOverride }>
      { children }
    </VibeProvider>
  );
}
