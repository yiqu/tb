import { z } from 'zod';

import { UserProfile } from '@/models/user/user.model';
import { PersonalInfoAddressSchema } from '@/validators/settings/account/PersonalInfo';

export function getDefaultPersonalInfoAddress(initData?: UserProfile | null): z.infer<typeof PersonalInfoAddressSchema> {
  return {
    address: initData?.address ?? '',
    city: initData?.city ?? '',
    state: initData?.state ?? '',
    zip: initData?.zip ?? '',
    country: initData?.country ?? '',
  };
}
