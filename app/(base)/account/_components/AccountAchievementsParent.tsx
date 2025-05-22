import Image from 'next/image';
import { Suspense } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import DisplayCard from '@/shared/components/DisplayCard';
import { UserAchievement } from '@/models/auth/user.model';
import Typography from '@/components/typography/Typography';
import { BorderBeam } from '@/components/magicui/border-beam';
import { getUserAchievements } from '@/server/user/user.server';
import ScrambleHover from '@/fancy/components/text/scramble-hover';

import { getAchievementImgUrl } from './account.utils';

export default async function AccountAchievementsParent() {
  return (
    <DisplayCard className="relative overflow-hidden p-4">
      <section className="flex flex-row items-center justify-between">
        <Typography variant="body0" className="font-semibold">
          <ScrambleHover
            text={ 'Achievements' }
            scrambleSpeed={ 50 }
            maxIterations={ 8 }
            useOriginalCharsOnly={ true }
            className=""
          />
        </Typography>
      </section>
      <section className={ `flex w-full flex-col items-start justify-start` }>
        <Suspense fallback={ <AchievementFallback /> }>
          <UserAchievementsWrapper />
        </Suspense>
      </section>
      <BorderBeam duration={ 10 } size={ 400 } className="from-transparent via-red-500 to-transparent" />
      <BorderBeam duration={ 10 } delay={ 3 } size={ 400 } className="from-transparent via-blue-500 to-transparent" />
    </DisplayCard>
  );
}

async function UserAchievementsWrapper() {
  const userAchievements: UserAchievement[] = await getUserAchievements();
  console.log(userAchievements);

  return (
    <div className="grid grid-cols-4 gap-2">
      { userAchievements.map((ach: UserAchievement) => {
        return (
          <Image
            key={ ach.achievementId }
            src={ getAchievementImgUrl(ach.achievementId, ach.level) }
            alt={ ach.achievementId }
            width={ 100 }
            height={ 100 }
            priority
          />
        );
      }) }
    </div>
  );
}

function AchievementFallback() {
  return <Skeleton className="h-[102px] w-[210px]" />;
}
