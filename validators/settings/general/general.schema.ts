import z from 'zod';

import { APP_VIBE_OPTIONS } from '@/models/settings/general-settings.models';

export const generalSettingsVibeSchema = z.object({
  vibe: z.enum(APP_VIBE_OPTIONS),
});
