import z from 'zod';

export const addNewFavoriteNameInputSchema = z.object({
  favoriteName: z.string().trim().min(1, { message: 'Name is required' }),
});

export const newFavoriteAddableSchema = z.object({
  favoriteName: z.string().trim().min(1, { message: 'Name is required' }),
  entityType: z.enum(['SUBSCRIPTION', 'BILL_DUE']),
  entityId: z.string().trim().min(1, { message: 'Entity ID is required' }),
});
