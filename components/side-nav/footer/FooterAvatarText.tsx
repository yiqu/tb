/* eslint-disable readable-tailwind/multiline */
import { Suspense } from 'react';
import { ShieldCheck } from 'lucide-react';

import { Skeleton } from '@/components/ui/skeleton';
import { UserProfile } from '@/models/user/user.model';
import { getUserCached } from '@/server/user/user.server';
import Typography from '@/components/typography/Typography';

async function FooterAvatarText({ user }: { user: UserProfile | null }) {
  return (
    <div className="grid flex-1 text-left text-sm leading-tight">
      <span className="truncate font-semibold">{ user?.name }</span>
      <span className={ `flex flex-row items-center justify-start gap-1 truncate text-xs` }>
        <ShieldCheck className="size-3 text-green-900 dark:text-green-500" />
        <Typography className={ 'text-xs leading-tight' }>{ user?.isAdmin ? 'Admin' : 'User' }</Typography>
      </span>
    </div>
  );
}

export default async function FooterAvatarTextSuspended() {
  const user: UserProfile | null = await getUserCached();

  return (
    <Suspense
      fallback={
        <section className="flex w-full flex-col gap-1">
          <Skeleton className="h-[17.5px] w-[100px]" />
          <Skeleton className="h-[12px] w-full" />
        </section>
      }
    >
      <FooterAvatarText user={ user } />
    </Suspense>
  );
}
