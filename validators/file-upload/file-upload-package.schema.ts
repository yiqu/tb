import { z } from 'zod';

export const fileUploadPackageSchema = z.object({
  packageName: z.string().trim().max(100, { message: 'Package name must be 100 characters or less' }),
});

export type FileUploadPackageFormValues = z.infer<typeof fileUploadPackageSchema>;
