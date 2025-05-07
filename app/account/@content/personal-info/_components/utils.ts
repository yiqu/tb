import { z } from 'zod';

import { PersonalInfoAddressSchema } from '@/validators/settings/account/PersonalInfo';

export function getDefaultPersonalInfoAddress(): z.infer<typeof PersonalInfoAddressSchema> {
  return {
    streetAddress: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  };
}
