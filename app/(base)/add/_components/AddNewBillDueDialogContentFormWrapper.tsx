'use client';

import z from 'zod';
import { ReactNode } from 'react';
import toast from 'react-hot-toast';
import { useQueryState } from 'nuqs';
import confetti from 'canvas-confetti';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';

import { Form } from '@/components/ui/form';
import { updateBillDue } from '@/server/bills/bills.server';
import { BillDueWithSubscription } from '@/models/bills/bills.model';
import { newBillDueSchema, billEditableSchema } from '@/validators/bills/bill.schema';
import { TANSTACK_QUERY_QUERY_KEY_ID_GENERAL, TANSTACK_QUERY_QUERY_KEY_BILL_DUE_DETAILS } from '@/constants/constants';

export default function AddNewBillDueDialogContentFormWrapper({
  children,
  subscriptionId,
}: {
  children: ReactNode;
  subscriptionId: string;
}) {
  const [, setAddBillDueSubscriptionId] = useQueryState('addBillDueSubscriptionId', {
    scroll: false,
  });
  const queryClient = useQueryClient();

  const methods = useForm<z.infer<typeof newBillDueSchema>>({
    // resolver: zodResolver(newBillDueSchema),
    defaultValues: {
      dueDate: '',
      paid: false,
      reimbursed: false,
    },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldFocusError: true,
  });

  const onSubmit = async (data: z.infer<typeof newBillDueSchema>) => {
    console.log('DATA: ', data);

    if (!methods.formState.isDirty) {
      return;
    }
  };

  return (
    <Form { ...methods }>
      <form onSubmit={ methods.handleSubmit(onSubmit) } id="add-new-bill-due-dialog-form">
        { children }
      </form>
    </Form>
  );
}
