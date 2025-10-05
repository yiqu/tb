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

export const FavoriteEntityEntityType = z.enum(['BILL_DUE', 'SUBSCRIPTION']);

export const FavoriteEntityResponse = z.object({
  id: z.string(),
  name: z.string(),
  entityType: FavoriteEntityEntityType,
  subscriptionId: z.string().nullable(),
  billDueId: z.string().nullable(),
});

export type FavoriteEntityResponseType = z.infer<typeof FavoriteEntityResponse>;
export type FavoriteEntityEntityTypeType = z.infer<typeof FavoriteEntityEntityType>;

export const getFavoriteEntityEntityTypeLabel = (entityType: FavoriteEntityEntityTypeType) => {
  return entityType === 'SUBSCRIPTION' ? 'Subscription' : 'Bill Due';
};

export type FavoriteActionType = 'EDIT' | 'CREATE' | 'DELETE';

export const getFavoriteActionLabel = (action: FavoriteActionType, isWorking: boolean, presentTense: boolean) => {
  let res = '';
  if (action === 'EDIT') {
    res =
      isWorking ? 'Editing favorite'
      : presentTense ? 'Edit favorite'
      : 'Edited favorite';
  } else if (action === 'CREATE') {
    res =
      isWorking ? 'Creating favorite'
      : presentTense ? 'Create favorite'
      : 'Created favorite';
  } else if (action === 'DELETE') {
    res =
      isWorking ? 'Removing favorite'
      : presentTense ? 'Remove favorite'
      : 'Removed favorite';
  }
  return res;
};

export type FavoriteEntity = {
  billDueId: string | null;
  entityType: FavoriteEntityEntityTypeType;
  id: string;
  name: string;
  subscriptionId: string | null;
  dateAdded: Date;
  updatedAt: Date | null;
  url: string | null;
};
