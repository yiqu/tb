import z from 'zod';

export const YEARLY_BILLS_MIN_YEAR = 2002;
export const YEARLY_BILLS_MAX_YEAR = 2200;

// Invalid or missing years resolve to undefined so the page falls back to the current year.
export const yearlyBillsSearchParamsSchema = z.object({
  year: z.coerce.number().int().min(YEARLY_BILLS_MIN_YEAR).max(YEARLY_BILLS_MAX_YEAR).optional().catch(undefined),
});

export type YearlyBillsSearchParams = z.infer<typeof yearlyBillsSearchParamsSchema>;
