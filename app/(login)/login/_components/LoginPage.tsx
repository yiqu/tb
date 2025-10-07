// import { connection } from 'next/server';

// import { getUser } from '@/server/user/user.server';
// import { UserProfile } from '@/models/user/user.model';
import Typography from '@/components/typography/Typography';

import AdminPasswordInputParent from './AdminPasswordInputParent';

export default async function LoginComponentPage() {
  //await connection();

  // const user: UserProfile | null = await getUser();

  if (true) {
    return (
      <div>
        <Typography variant="h5">User not found</Typography>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <AdminPasswordInputParent user={ null } />
    </div>
  );
}
