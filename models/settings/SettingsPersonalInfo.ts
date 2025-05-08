import { z } from 'zod';

import { displayNameSchema, PersonalInfoAddressSchema } from '@/validators/settings/account/PersonalInfo';

export type SettingsPersonalInfoDisplayNameActionState = {
  isSuccess: boolean;
  statusCode?: number;
  zodErrorIssues?: z.ZodIssue[];
  result: z.infer<typeof displayNameSchema>;
  updatedAt?: string | Date | null;
};

export type SettingsPersonalInfoAdminModeActionState = {
  isSuccess: boolean;
  statusCode?: number;
  zodErrorIssues?: z.ZodIssue[];
  result: boolean;
  updatedAt?: string | Date | null;
  message?: string;
};

export type SettingsPersonalInfoLocationActionState = {
  isSuccess: boolean;
  statusCode?: number;
  zodErrorIssues?: z.ZodIssue[];
  result: z.infer<typeof PersonalInfoAddressSchema>;
  updatedAt?: string | Date | null;
  message?: string;
};
