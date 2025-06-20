import DisplayCard from '@/shared/components/DisplayCard';
import DisplayCardContentDivider from '@/shared/components/DisplayCardContentDivider';

import { CardContent } from '../ui/card';
import EditBillIsPaid from './EditBillIsPaid';
import EditBillDueDate from './EditBillDueDate';
import EditBillCurrency from './EditBillCurrency';
import EditBillIsReimbursed from './EditBillIsReimbursed';
import EditBillSubscriptionsWrapper from './EditBillSubscriptionsWrapper';

export default function EditBillForm() {
  return (
    <DisplayCard>
      <CardContent className="flex w-full flex-col items-start justify-start gap-y-4">
        <EditBillDueDate />
        <DisplayCardContentDivider />
        <EditBillCurrency />
        <DisplayCardContentDivider />
        <EditBillSubscriptionsWrapper />
        <DisplayCardContentDivider />
        <EditBillIsPaid />
        <DisplayCardContentDivider />
        <EditBillIsReimbursed />
      </CardContent>
    </DisplayCard>
  );
}
