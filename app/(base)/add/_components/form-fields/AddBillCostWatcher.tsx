'use client';

import z from 'zod';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useWatch, useFormContext } from 'react-hook-form';

import { billAddableSchema } from '@/validators/bills/bill.schema';
import { getSubscriptionByIdQueryOptions } from '@/server/subscriptions/query/subscription.query';

export default function AddBillCostWatcher() {
  const { control, setValue } = useFormContext<z.infer<typeof billAddableSchema>>();
  const subscriptionId = useWatch({ control, name: 'subscriptionId' });
  console.log('subscriptionId', subscriptionId);
  const { data, isError } = useQuery({
    ...getSubscriptionByIdQueryOptions(subscriptionId),
    enabled: !!subscriptionId,
  });

  useEffect(() => {
    if (data && !isError) {
      console.log('setting cost to ', data.cost);
      setValue('cost', data.cost);
    }
  }, [data, isError, setValue]);

  return null;
}
