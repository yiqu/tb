import Typography from '@/components/typography/Typography';
import { DialogTitle, DialogHeader, DialogDescription } from '@/components/ui/dialog';

export default function EditSubscriptionDialogTitle() {
  return (
    <DialogHeader className="px-4">
      <DialogTitle>Edit Subscription</DialogTitle>
      <DialogDescription asChild>
        <div className="flex w-full flex-row items-center justify-between gap-x-1">
          <div className="flex flex-row items-center justify-start gap-x-1">
            <Typography>Edit subscription details.</Typography>
          </div>
          <div className="flex flex-row items-center justify-end gap-x-2"></div>
        </div>
      </DialogDescription>
    </DialogHeader>
  );
}
