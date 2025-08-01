'use client';

import { ReactNode } from 'react';
import { X, Save, RefreshCcw } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import DateRelativeDisplay from '@/shared/table/DateRelativeDisplay';
import { getBillDueByIdQueryOptions } from '@/server/bills/query/bills.query';
import { TANSTACK_QUERY_QUERY_KEY_ID_GENERAL, TANSTACK_QUERY_QUERY_KEY_BILL_DUE_DETAILS } from '@/constants/constants';
import { DialogClose, DialogTitle, DialogFooter, DialogHeader, DialogContent, DialogDescription } from '@/components/ui/dialog';

import { Alert } from '../alerts/Alert';
import { Skeleton } from '../ui/skeleton';
import { Separator } from '../ui/separator';
import Typography from '../typography/Typography';
import EditBillDialogFormWrapper from './EditBillDialogFormWrapper';
import EditBillDialogResetButton from './EditBillDialogResetButton';

export default function EditBillDialogContent({ billDueId, children }: { billDueId: string; children: ReactNode }) {
  const queryClient = useQueryClient();
  const { isLoading, isError, error, data, isFetching, dataUpdatedAt } = useQuery({
    ...getBillDueByIdQueryOptions(billDueId),
  });

  const isBillLoaded: boolean = !!(!isLoading && data && !isError);
  const isBillLoading: boolean = isLoading || isFetching;

  const handleOnRefetch = () => {
    queryClient.invalidateQueries({
      queryKey: [
        TANSTACK_QUERY_QUERY_KEY_BILL_DUE_DETAILS,
        {
          [TANSTACK_QUERY_QUERY_KEY_ID_GENERAL]: billDueId,
        },
      ],
    });
  };

  return (
    <DialogContent
      className={ `
        overflow-x-auto px-0 pb-0
        two:w-[800px] two:max-w-[1000px]!
        main:w-[1000px] main:max-w-[1200px]!
        sm:max-w-[600px]
      ` }
    >
      <DialogHeader className="px-4">
        <DialogTitle>Edit Bill</DialogTitle>
        <DialogDescription asChild>
          <div className="flex w-full flex-row items-center justify-between gap-x-1">
            <div className="flex flex-row items-center justify-start gap-x-1">
              <Typography>Make changes to your bill.</Typography>
              <Button variant="ghost" size="icon" onClick={ handleOnRefetch }>
                <RefreshCcw className={ cn({ 'animate-spin': isFetching }) } />
              </Button>
            </div>
            <div className="flex flex-row items-center justify-end gap-x-2">
              <DateRelativeDisplay time={ `${dataUpdatedAt}` } includeParenthesis={ false } prefixText="Last updated:" />
            </div>
          </div>
        </DialogDescription>
      </DialogHeader>
      <Separator />
      { isError ?
        <div className="flex w-full flex-col">
          <Alert description={ <Typography>{ error.message }</Typography> } variant="danger" />
        </div>
      : null }
      { isBillLoaded && data ?
        <EditBillDialogFormWrapper billDue={ data } key={ `${dataUpdatedAt}` }>
          <div className="px-4">{ children }</div>
          <DialogFooter className={ `
            mt-4 flex w-full flex-row bg-sidebar p-4
            sm:items-center sm:justify-between
          ` }>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                <X />
                Cancel
              </Button>
            </DialogClose>
            <div className="flex flex-row items-center justify-end gap-x-2">
              <EditBillDialogResetButton />
              <Button
                type="submit"
                className="w-[90px]"
                id="edit-bill-dialog-save-button"
                disabled={ isBillLoading || isFetching }
                form="edit-bill-dialog-form"
              >
                <Save />
                Save
              </Button>
            </div>
          </DialogFooter>
        </EditBillDialogFormWrapper>
      : <div className="mb-4 flex flex-col justify-start gap-y-4 px-4">
        <Skeleton className="h-[5rem] w-full" />
        <Skeleton className="h-[5rem] w-full" />
        <Skeleton className="h-[5rem] w-full" />
        <Skeleton className="h-[5rem] w-full" />
        <Skeleton className="h-[10.5rem] w-full" />
      </div>
      }
    </DialogContent>
  );
}
