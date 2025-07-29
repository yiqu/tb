'use client';

import z from 'zod';
import { ReactNode } from 'react';
import toast from 'react-hot-toast';
import { useQueryState } from 'nuqs';
import confetti from 'canvas-confetti';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';

import { updateBillDue } from '@/server/bills/bills.server';
import { billEditableSchema } from '@/validators/bills/bill.schema';
import { BillDueWithSubscription } from '@/models/bills/bills.model';
import { TANSTACK_QUERY_QUERY_KEY_ID_GENERAL, TANSTACK_QUERY_QUERY_KEY_BILL_DUE_DETAILS } from '@/constants/constants';

import { Form } from '../ui/form';

export default function EditBillDialogFormWrapper({ children, billDue }: { children: ReactNode; billDue: BillDueWithSubscription }) {
  const [, setEditBillId] = useQueryState('editBillId', {
    history: 'push',
    scroll: false,
  });
  const queryClient = useQueryClient();
  const billCost: number = billDue.cost === null ? billDue.subscription.cost : billDue.cost;

  const methods = useForm<z.infer<typeof billEditableSchema>>({
    resolver: zodResolver(billEditableSchema),
    defaultValues: {
      cost: billCost,
      subscriptionId: billDue.subscription.id,
      dueDate: billDue.dueDate,
      paid: billDue.paid,
      reimbursed: billDue.reimbursed,
    },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldFocusError: true,
  });

  const onSubmit = async (data: z.infer<typeof billEditableSchema>) => {
    if (!methods.formState.isDirty) {
      return;
    }

    const submitButton: HTMLButtonElement | null = document.getElementById('edit-bill-dialog-save-button') as HTMLButtonElement;

    if (submitButton) {
      submitButton.disabled = true;
    }

    toast.promise(updateBillDue(billDue.id, data), {
      loading: 'Updating bill...',
      success: (res: BillDueWithSubscription) => {
        methods.reset({
          cost: res.cost ?? res.subscription.cost,
          subscriptionId: res.subscription.id,
          dueDate: res.dueDate,
          paid: res.paid,
          reimbursed: res.reimbursed,
        });

        if (submitButton) {
          submitButton.disabled = false;
        }
        queryClient.invalidateQueries({
          queryKey: [
            TANSTACK_QUERY_QUERY_KEY_BILL_DUE_DETAILS,
            {
              [TANSTACK_QUERY_QUERY_KEY_ID_GENERAL]: billDue.id,
            },
          ],
        });

        confetti({
          particleCount: 50,
        });

        setEditBillId(null, {
          history: 'replace',
          scroll: false,
        });

        return `${res.subscription.name}'s bill updated successfully.`;
      },
      error: (error: Error) => {
        if (submitButton) {
          submitButton.disabled = false;
        }
        return `Failed to update bill. ${error.message}`;
      },
    });
  };

  return (
    <Form { ...methods }>
      <form onSubmit={ methods.handleSubmit(onSubmit) } id="edit-bill-dialog-form">
        { children }
      </form>
    </Form>
  );
}
