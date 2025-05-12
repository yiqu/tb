import { getUser } from '@/server/user/user.server';
import { UserProfile } from '@/models/user/user.model';
import Typography from '@/components/typography/Typography';

export default async function AccountLeftNavNameDisplay() {
  const userProfile: UserProfile | null = await getUser();

  if (!userProfile) {
    return (
      <div>
        <Typography variant="h5">No account found</Typography>
      </div>
    );
  }

  return (
    <div>
      <Typography variant="h4">{ userProfile.name }</Typography>
    </div>
  );
}
