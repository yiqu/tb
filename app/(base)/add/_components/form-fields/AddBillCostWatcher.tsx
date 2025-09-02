'use client';

import z from 'zod';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';

import { billAddableSchema } from '@/validators/bills/bill.schema';
import { getSubscriptionByIdQueryOptions } from '@/server/subscriptions/query/subscription.query';

export default function AddBillCostWatcher() {
  const { watch, setValue } = useFormContext<z.infer<typeof billAddableSchema>>();
  const subscriptionId = watch('subscriptionId');
  const { data, isError } = useQuery({
    ...getSubscriptionByIdQueryOptions(subscriptionId),
    enabled: !!subscriptionId,
  });

  useEffect(() => {
    if (data && !isError) {
      console.log("setting cost to ", data.cost);
      setValue('cost', data.cost);
    }
  }, [data, isError, setValue]);

  return null;
}
