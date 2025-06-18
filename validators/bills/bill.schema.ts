import { z } from 'zod';

export const billEditableSchema = z.object({
  subscriptionId: z.string().min(1, { message: 'Subscription ID can not be empty' }).optional(),
  dueDate: z.string().min(1, { message: 'Due date can not be empty' }).optional(),
  paid: z.boolean().optional(),
  reimbursed: z.boolean().optional(),
  cost: z.number().min(0, { message: 'Cost can not be less than 0' }),
});
