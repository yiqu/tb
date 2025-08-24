import { z } from 'zod';

export const subscriptionEditableSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  description: z.string().optional(),
  url: z.string().optional(),
  approved: z.boolean().optional(),
  signed: z.boolean().optional(),
  cost: z.union([z.string(), z.number()]).superRefine((val, ctx) => {
    if (val === '' || val === null || val === undefined) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Cost is required' });
      return;
    }
    const num = Number.parseFloat(val.toString());
    if (Number.isNaN(num)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Cost is not a number' });
    }
    if (num < 0) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Cost can not be less than 0' });
    }
  }),
  billCycleDuration: z.enum(['yearly', 'monthly', 'once'], { required_error: 'Bill cycle duration is required' }),
});

export const subscriptionAddableSchema = z.object({
  name: z.string().trim().min(1, { message: 'Name is required' }),
  description: z.string().optional(),
  url: z.string().optional(),
  cost: z.union([z.string(), z.number()]).superRefine((val, ctx) => {
    if (val === '' || val === null || val === undefined) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Cost is required' });
      return;
    }
    const num = Number.parseFloat(val.toString());
    if (Number.isNaN(num)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Cost is not a number' });
    }
    if (num < 0) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Cost can not be less than 0' });
    }
  }),
  billCycleDuration: z.enum(['yearly', 'monthly', 'once'], { required_error: 'Bill cycle duration is required' }),
  approved: z.boolean().optional(),
  signed: z.boolean().optional(),
});

export const subscriptionSearchParamsSchema = z.object({
  frequency: z.string().optional(),
  subscriptions: z.string().optional(),
  page: z.number().optional(),
  addBillDueSubscriptionId: z.string().optional(),
});
