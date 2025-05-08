import { getUser } from '@/server/user/user.server';
import { UserProfile } from '@/models/user/user.model';

import LocationInfoForm from './LocationInfoForm';
import CountryListWrapper from './CountryListWrapper';

export default async function LocationInfoWrapper() {
  const user: UserProfile | null = await getUser();

  return (
    <LocationInfoForm user={ user }>
      <CountryListWrapper />
    </LocationInfoForm>
  );
}
