import { UserProfile } from '@/models/user/user.model';
import { getUser, getUserCached } from '@/server/user/user.server';

import LocationInfoForm from './LocationInfoForm';
import CountryListWrapper from './CountryListWrapper';

export default async function LocationInfoWrapper() {
  const user: UserProfile | null = await getUserCached();

  return (
    <LocationInfoForm user={ user }>
      <CountryListWrapper />
    </LocationInfoForm>
  );
}
