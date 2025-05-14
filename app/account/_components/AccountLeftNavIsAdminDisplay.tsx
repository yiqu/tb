/* eslint-disable readable-tailwind/multiline */
import { ShieldCheck } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { UserProfile } from '@/models/user/user.model';
import { getUserCached } from '@/server/user/user.server';
import Typography from '@/components/typography/Typography';
import { AuroraText } from '@/components/magicui/aurora-text';

export default async function AccountLeftNavIsAdminDisplay() {
  const userProfile: UserProfile | null = await getUserCached();

  if (!userProfile) {
    return null;
  }

  if (userProfile.isAdmin) {
    return (
      <Badge variant="secondary">
        <div className="flex flex-row items-center justify-start gap-x-2">
          <ShieldCheck size={ 16 } className={ `text-green-800 dark:text-green-500` } />

          <Typography variant="body0">
            <AuroraText>Admin</AuroraText>
          </Typography>
        </div>
      </Badge>
    );
  }

  return null;
}
