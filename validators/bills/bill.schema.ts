import { z } from 'zod';

export const billEditableSchema = z.object({
  subscriptionId: z.string().min(1, { message: 'Subscription is required' }),
  dueDate: z.string().min(1, { message: 'Due date is required' }),
  paid: z.boolean().optional(),
  reimbursed: z.boolean().optional(),
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
});

export const billAddableSchema = z.object({
  subscriptionId: z.string().min(1, { message: 'Subscription is required' }),
  consecutiveAdd: z.boolean().optional(),
  dueDate: z.string().min(1, { message: 'Due date is required' }),
  paid: z.boolean().optional(),
  reimbursed: z.boolean().optional(),
  cost: z.union([z.string(), z.number()]).superRefine((val, ctx) => {
    if (val === '' || val === null || val === undefined) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Cost is required' });
      return;
    }
    const num = Number.parseFloat(val.toString());
    if (Number.isNaN(num)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Cost is not a number' });
    }
    if (num <= 0) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Cost can not be less than or equal to 0' });
    }
  }),
});

export const billSearchParamsSchema = z.object({
  frequency: z.string().optional(),
  paymentStatus: z
    .enum([
      'paid-only',
      'reimbursed-only',
      'paid-or-reimbursed',
      'paid-and-reimbursed',
      'need-payment-or-reimbursement',
      'need-payment-and-reimbursement',
    ])
    .optional(),
  subscriptions: z.string().optional(),
  year: z.string().optional(),
  month: z.string().optional(),
  page: z.number().optional(),
});

export const newBillDueSchema = z.object({
  dueDate: z.string().min(1, { message: 'Due date is required' }),
  paid: z.boolean().optional(),
  reimbursed: z.boolean().optional(),
});

export const autoSelectedDefaultStatus = z.enum(['need-payment-or-reimbursement', 'future-include-today']);

export type AutoSelectedDefaultStatus = z.infer<typeof autoSelectedDefaultStatus>;
