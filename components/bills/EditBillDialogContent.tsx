'use client';

import { ReactNode } from 'react';
import { X, Save, RefreshCcw } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';
import DateRelativeDisplay from '@/shared/table/DateRelativeDisplay';
import StyledDialogFooter from '@/shared/dialogs/StyledDialogFooter';
import StyledDialogContent from '@/shared/dialogs/StyledDialogContent';
import { getBillDueByIdQueryOptions } from '@/server/bills/query/bills.query';
import { TANSTACK_QUERY_QUERY_KEY_ID_GENERAL, TANSTACK_QUERY_QUERY_KEY_BILL_DUE_DETAILS } from '@/constants/constants';

import { Alert } from '../alerts/Alert';
import { Skeleton } from '../ui/skeleton';
import Typography from '../typography/Typography';
import EditBillDialogFormWrapper from './EditBillDialogFormWrapper';
import EditBillDialogResetButton from './EditBillDialogResetButton';
import EditBillDialogFavoriteBillToggleButton from './EditBillDialogFavoriteBillToggleButton';

export default function EditBillDialogContent({ billDueId, children }: { billDueId: string; children: ReactNode }) {
  const queryClient = useQueryClient();
  const { isLoading, isError, error, data, isFetching } = useQuery({
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
    <StyledDialogContent
      headerTitle="Edit Bill"
      headerDescription={
        <div className="flex w-full flex-row items-center justify-between gap-x-1">
          <div className="flex flex-row items-center justify-start gap-x-1">
            <Typography>Make changes to your bill.</Typography>
            <Button variant="ghost" size="icon" onClick={ handleOnRefetch }>
              <RefreshCcw className={ cn({ 'animate-spin': isFetching }) } />
            </Button>
          </div>
          { data ?
            <div className="flex flex-row items-center justify-end gap-x-2">
              <DateRelativeDisplay time={ `${data?.updatedAt}` } includeParenthesis={ false } prefixText="Last edited:" />
            </div>
          : <Skeleton className="h-5 w-40" /> }
        </div>
      }
    >
      { isError ?
        <div className="flex w-full flex-col">
          <Alert description={ <Typography>{ error.message }</Typography> } variant="danger" />
        </div>
      : null }
      { isBillLoaded && data ?
        <EditBillDialogFormWrapper billDue={ data }>
          <div className="px-4">{ children }</div>
          <StyledDialogFooter>
            <div className="flex w-full flex-row items-center justify-between gap-x-2">
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  <X />
                  Cancel
                </Button>
              </DialogClose>
              <div className="flex flex-row items-center justify-end gap-x-2">
                <EditBillDialogFavoriteBillToggleButton billDue={ data } />
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
            </div>
          </StyledDialogFooter>
        </EditBillDialogFormWrapper>
      : <div className="mb-4 flex flex-col justify-start gap-y-4 px-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-42 w-full" />
      </div>
      }
    </StyledDialogContent>
  );
}
