import { z } from 'zod';

/** The two required fields of the upload form. They are the JSON body of the start request (`PWS_MODEL_UPLOAD_START_URL`). */
export const pwsModelUploadSchema = z.object({
  /** The name the model file is stored under, it replaces the original file name. */
  name: z.string().trim().min(1, { message: 'Name is required' }).max(255, { message: 'Name must be 255 characters or less' }),
  /** Associated with the model when the backend creates it. */
  modelKey: z.string().trim().min(1, { message: 'Model key is required' }).max(255, { message: 'Model key must be 255 characters or less' }),
});

export type PwsModelUploadFormValues = z.infer<typeof pwsModelUploadSchema>;
