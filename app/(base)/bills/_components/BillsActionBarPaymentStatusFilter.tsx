'use client';

import { X } from 'lucide-react';
import { parseAsString, parseAsInteger, useQueryStates } from 'nuqs';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectValue,
  SelectContent,
  SelectTrigger,
  SelectSeparator,
} from '@/components/ui/select';

export default function BillsActionBarPaymentStatusFilter() {
  const [paymentStatus, setPaymentStatus] = useQueryStates(
    {
      paymentStatus: parseAsString
        .withOptions({
          history: 'push',
          scroll: false,
          shallow: false,
        })
        .withDefault(''),
      page: parseAsInteger
        .withOptions({
          history: 'push',
          scroll: false,
          shallow: false,
        })
        .withDefault(1),
    },
    {
      history: 'push',
      scroll: false,
      shallow: false,
    },
  );

  const handleOnStatusChange = (status: string) => {
    if (status === 'none') {
      setPaymentStatus({
        paymentStatus: null,
        page: 1,
      });
    } else {
      setPaymentStatus({
        paymentStatus: status,
        page: 1,
      });
    }
  };

  const handleClearStatusValue = () => {
    setPaymentStatus({
      paymentStatus: null,
      page: 1,
    });
  };

  const isStatusValueSelected: boolean = paymentStatus.paymentStatus !== null && paymentStatus.paymentStatus !== '';

  return (
    <div className="flex flex-row items-center justify-start gap-x-2">
      <div className="relative">
        <Select onValueChange={ handleOnStatusChange } value={ paymentStatus.paymentStatus ?? '' }>
          <SelectTrigger className={ cn('min-w-[9rem] cursor-pointer bg-card font-medium select-none', isStatusValueSelected && `pr-7`) }>
            <SelectValue placeholder="Payment status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Reset</SelectLabel>
              <SelectItem key="clear" value="none" onClick={ handleClearStatusValue }>
                Clear status
              </SelectItem>
            </SelectGroup>

            <SelectSeparator />

            <SelectGroup>
              <SelectLabel>Need payment or reimbursement</SelectLabel>

              { STATUS_OPTIONS_3.map((option) => (
                <SelectItem key={ option.value } value={ option.value }>
                  { option.label }
                </SelectItem>
              )) }
            </SelectGroup>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel>Paid / Reimbursed</SelectLabel>
              { STATUS_OPTIONS_2.map((option) => (
                <SelectItem key={ option.value } value={ option.value }>
                  { option.label }
                </SelectItem>
              )) }
            </SelectGroup>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel>Only</SelectLabel>
              { STATUS_OPTIONS_1.map((option) => (
                <SelectItem key={ option.value } value={ option.value }>
                  { option.label }
                </SelectItem>
              )) }
            </SelectGroup>
          </SelectContent>
        </Select>
        { isStatusValueSelected ?
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={ `
              absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2 p-0
              hover:bg-background
            ` }
            onClick={ handleClearStatusValue }
          >
            <X className="size-4" />
          </Button>
        : null }
      </div>
    </div>
  );
}

const STATUS_OPTIONS_1 = [
  { label: 'Paid only', value: 'paid-only' },
  { label: 'Reimbursed only', value: 'reimbursed-only' },
];

const STATUS_OPTIONS_2 = [
  { label: 'Paid or reimbursed', value: 'paid-or-reimbursed' },
  { label: 'Paid and reimbursed', value: 'paid-and-reimbursed' },
];

const STATUS_OPTIONS_3 = [
  { label: 'Need payment or reimbursement', value: 'need-payment-or-reimbursement' },
  { label: 'Need payment and reimbursement', value: 'need-payment-and-reimbursement' },
];
