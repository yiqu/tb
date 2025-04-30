import { getUser } from '@/server/user/user.server';
import { UserProfile } from '@/models/user/user.model';

import DisplayNameForm from './DisplayNameForm';

export default async function DisplayNameWrapper() {
  const user: UserProfile | null = await getUser();

  return <DisplayNameForm user={ user } />;
}
