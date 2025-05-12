import { ShieldCheck } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { getUser } from '@/server/user/user.server';
import { UserProfile } from '@/models/user/user.model';
import Typography from '@/components/typography/Typography';

export default async function AccountLeftNavIsAdminDisplay() {
  const userProfile: UserProfile | null = await getUser();

  if (!userProfile) {
    return null;
  }

  if (userProfile.isAdmin) {
    return (
      <Badge variant="secondary">
        <div className="flex flex-row items-center justify-start gap-x-2">
          <ShieldCheck size={ 16 } />
          <Typography variant="body0" className="uppercase">
            Admin
          </Typography>
        </div>
      </Badge>
    );
  }

  return null;
}
