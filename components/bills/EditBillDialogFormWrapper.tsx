'use client';

import z from 'zod';
import { ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { billEditableSchema } from '@/validators/bills/bill.schema';
import { BillDueWithSubscription } from '@/models/bills/bills.model';

import { Form } from '../ui/form';

export default function EditBillDialogFormWrapper({ children, billDue }: { children: ReactNode; billDue: BillDueWithSubscription }) {
  const billCost: number = billDue.cost === null ? billDue.subscription.cost : billDue.cost;
  console.log(billDue);
  
  const methods = useForm<z.infer<typeof billEditableSchema>>({
    resolver: zodResolver(billEditableSchema),
    defaultValues: {
      cost: billCost,
    },
  });

  const onSubmit = (data: z.infer<typeof billEditableSchema>) => {
    console.log('submitted', data);
  };

  return (
    <Form { ...methods }>
      <form onSubmit={ methods.handleSubmit(onSubmit) }>{ children }</form>
    </Form>
  );
}
