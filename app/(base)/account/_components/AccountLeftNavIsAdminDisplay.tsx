/* eslint-disable better-tailwindcss/enforce-consistent-line-wrapping */
import { ShieldCheck } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { UserProfile } from '@/models/user/user.model';
import { getUserCached } from '@/server/user/user.server';
import Typography from '@/components/typography/Typography';
import { AuroraText } from '@/components/magicui/aurora-text';
import { ShineBorder } from '@/components/magicui/shine-border';

export default async function AccountLeftNavIsAdminDisplay() {
  const userProfile: UserProfile | null = await getUserCached();

  if (!userProfile) {
    return null;
  }

  if (userProfile.isAdmin) {
    return (
      <Badge variant="secondary" className="relative max-w-[6rem] overflow-hidden">
        <ShineBorder shineColor={ ['#A07CFE', '#FE8FB5', '#FFBE7B'] } borderWidth={ 2 } duration={ 20 } />
        <div className="flex flex-row items-center justify-start gap-x-2 truncate">
          <ShieldCheck size={ 16 } className={ `text-green-800 dark:text-green-500` } />
          <Typography variant="body0" className="truncate">
            <AuroraText>Admin</AuroraText>
          </Typography>
        </div>
      </Badge>
    );
  }

  return null;
}
