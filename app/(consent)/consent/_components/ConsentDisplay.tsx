import { DateTime } from 'luxon';
import { cacheLife } from 'next/cache';

import { appName } from '@/constants/constants';
import { EST_TIME_ZONE } from '@/lib/general.utils';
import RowStack from '@/shared/components/RowStack';
import { WEST_D_PALETTE } from '@/lib/color-palettes';
import Typography from '@/components/typography/Typography';
import { AuroraText } from '@/components/magicui/aurora-text';
import CustomToaster from '@/components/toaster/CustomToaster';

import TodayDate from './TodayDate';
import ConsentTitleLogo from './ConsentTitleLogo';
import ConsentContentCard from './ConsentContentCard';
import BackgroundThemeSelector from './BackgroundThemeSelector';

export default async function ConsentDisplay() {
  'use cache';
  cacheLife('weeks');

  const dateString = DateTime.now().setZone(EST_TIME_ZONE).toFormat('MM-dd-yyyy');
  const currentMonth = DateTime.now().setZone(EST_TIME_ZONE).month;
  return (
    <div className="fixed inset-0 flex h-full w-full flex-col items-center justify-center">
      <CustomToaster />
      <BackgroundThemeSelector currentMonth={ currentMonth } />
      <div className="fixed">
        <RowStack className="items-center justify-between">
          <RowStack className="items-center gap-x-2">
            <ConsentTitleLogo />
            <Typography variant="h3" className="font-fun text-3xl tracking-widest text-border">
              <AuroraText colors={ WEST_D_PALETTE }>{ appName }</AuroraText>
            </Typography>
          </RowStack>
          <TodayDate dateString={ dateString } />
        </RowStack>
        <ConsentContentCard />
      </div>
    </div>
  );
}
