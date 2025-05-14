import { UserProfile } from '@/models/user/user.model';
import { getUserCached } from '@/server/user/user.server';

import AdminModeForm from './AdminModeForm';

export default async function AdminModeWrapper() {
  const user: UserProfile | null = await getUserCached();

  return <AdminModeForm user={ user } />;
}
