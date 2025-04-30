import { z } from 'zod';

import { displayNameSchema } from '@/validators/settings/account/PersonalInfo';

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
};

