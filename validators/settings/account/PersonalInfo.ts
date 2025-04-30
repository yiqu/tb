import { z } from 'zod';

export const displayNameSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: 'Display name can not be empty' })
      .max(32, { message: 'Display name must be less than 32 characters' }),
  })
  .superRefine((data, ctx) => {
    if (data.name.includes('@')) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Display name can not include @',
        path: ['displayName'],
      });
    }
  });
