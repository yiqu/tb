'use client';

import z from 'zod';
import { DateTime } from 'luxon';
import { ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Form } from '@/components/ui/form';
import { EST_TIME_ZONE } from '@/lib/general.utils';
import { billAddableSchema } from '@/validators/bills/bill.schema';

export default function AddNewBillFormWrapper({ children }: { children: ReactNode }) {
  const currentDateLuxon = DateTime.now().setZone(EST_TIME_ZONE);
  const currentDateLuxonMidDay12pm: string = currentDateLuxon.set({ hour: 12, minute: 0, second: 0, millisecond: 0 }).toMillis().toString();

  const methods = useForm<z.infer<typeof billAddableSchema>>({
    defaultValues: {
      dueDate: currentDateLuxonMidDay12pm,
      paid: true,
      reimbursed: false,
      cost: 0,
      subscriptionId: '',
      consecutiveAdd: false,
    },
    resolver: zodResolver(billAddableSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldFocusError: true,
  });

  const onSubmit = (data: z.infer<typeof billAddableSchema>) => {
    console.log(data);
  };

  return (
    <Form { ...methods }>
      <form onSubmit={ methods.handleSubmit(onSubmit) } id="add-new-bill-due-page-form">
        { children }
      </form>
    </Form>
  );
}
