import { CardContent } from '@/components/ui/card';
import DisplayCard from '@/shared/components/DisplayCard';
import DisplayCardContentDivider from '@/shared/components/DisplayCardContentDivider';

import AddBillIsPaid from './form-fields/AddBillIsPaid';
import AddBillDueDate from './form-fields/AddBillDueDate';
import AddBillCurrency from './form-fields/AddBillCurrency';
import AddBillIsReimbursed from './form-fields/AddBillIsReimbursed';

export default function AddNewBillDueDialogContentCard() {
  return (
    <div className="px-4">
      <DisplayCard>
        <CardContent className="flex w-full flex-col items-start justify-start gap-y-4">
          <AddBillDueDate />
          <DisplayCardContentDivider />
          <AddBillCurrency />
          <DisplayCardContentDivider />
          <AddBillIsPaid />
          <DisplayCardContentDivider />
          <AddBillIsReimbursed />
        </CardContent>
      </DisplayCard>
    </div>
  );
}
