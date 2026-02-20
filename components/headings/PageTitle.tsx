import { ReactNode } from 'react';

import { getSettingsApplicationCompactMode } from '@/server/settings/app-settings';

import Typography from '../typography/Typography';

export default async function PageTitle({ title, subText }: { title: ReactNode; subText?: ReactNode }) {
  const isCompactMode = await getSettingsApplicationCompactMode();

  if (isCompactMode) {
    return null;
  }

  return (
    <section className="mb-6 flex w-full flex-col gap-y-2" id="page-title-parent">
      <Typography variant="h1" className="font-fun tracking-wide">
        { title }
      </Typography>
      <section>
        <Typography variant="body1" className="font-sans">
          { subText }
        </Typography>
      </section>
    </section>
  );
}
