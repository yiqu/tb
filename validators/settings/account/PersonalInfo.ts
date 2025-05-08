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

export const PersonalInfoAddressSchema = z.object({
  address: z.string().min(1, { message: 'Street address can not be empty' }),
  city: z.string().min(1, { message: 'City can not be empty' }),
  state: z.string({ message: 'State can not be empty' }).min(2, { message: 'State must be at least 2 characters' }),
  zip: z.string({ message: 'Zip can not be empty' }).min(5, { message: 'Zip must be at least 5 characters' }),
  country: z
    .string({ message: 'Country can not be empty' })
    .min(2, { message: 'Country must be at least 2 characters' }),
});
