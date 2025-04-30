import { getUser } from '@/server/user/user.server';
import { UserProfile } from '@/models/user/user.model';

import AdminModeForm from './AdminModeForm';

export default async function AdminModeWrapper() {
  const user: UserProfile | null = await getUser();

  return <AdminModeForm user={ user } />;
}
