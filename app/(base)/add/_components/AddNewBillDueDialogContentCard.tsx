import { CardContent } from '@/components/ui/card';
import DisplayCard from '@/shared/components/DisplayCard';
import DisplayCardContentDivider from '@/shared/components/DisplayCardContentDivider';

export default function AddNewBillDueDialogContentCard() {
  return (
    <div className="px-4">
      <DisplayCard>
        <CardContent className="flex w-full flex-col items-start justify-start gap-y-4">
          FORM
          <DisplayCardContentDivider />
        </CardContent>
      </DisplayCard>
    </div>
  );
}
