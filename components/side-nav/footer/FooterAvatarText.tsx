/* eslint-disable better-tailwindcss/multiline */
import { ShieldCheck } from 'lucide-react';

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

  return <FooterAvatarText user={ user } />;
}
