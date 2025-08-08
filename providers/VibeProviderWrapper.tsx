import { ReactNode } from 'react';

import { getSettingsApplicationVibe } from '@/server/settings/vibe-select';

import VibeProvider from './VibeProvider';

export default async function VibeProviderWrapper({ children }: { children: ReactNode }) {
  const vibe = await getSettingsApplicationVibe();

  return <VibeProvider vibe={ vibe }>{ children }</VibeProvider>;
}
