import { UserProfile } from '@/models/user/user.model';
import { getUserCached } from '@/server/user/user.server';

import DisplayNameForm from './DisplayNameForm';

export default async function DisplayNameWrapper() {
  const user: UserProfile | null = await getUserCached();

  return <DisplayNameForm user={ user } />;
}
