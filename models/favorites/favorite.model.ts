import { z } from 'zod';

export const FavoriteEntityInput = z.union([
  z.object({
    name: z.string().min(1),
    entityType: z.literal('BILL_DUE'),
    billDueId: z.string(),
    subscriptionId: z.undefined().or(z.null()).optional(),
  }),
  z.object({
    name: z.string().min(1),
    entityType: z.literal('SUBSCRIPTION'),
    subscriptionId: z.string(),
    billDueId: z.undefined().or(z.null()).optional(),
  }),
]);
