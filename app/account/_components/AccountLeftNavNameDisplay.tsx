import { UserProfile } from '@/models/user/user.model';
import { getUserCached } from '@/server/user/user.server';
import Typography from '@/components/typography/Typography';

import NameDisplay from './AccountLeftNavNameTextDisplay';

export default async function AccountLeftNavNameDisplay() {
  const userProfile: UserProfile | null = await getUserCached();

  if (!userProfile) {
    return (
      <div>
        <Typography variant="h5">No account found</Typography>
      </div>
    );
  }

  return (
    <div key={ userProfile.name }>
      <NameDisplay name={ userProfile.name } />
    </div>
  );
}
