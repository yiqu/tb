import { ReactNode } from 'react';

import StyledDialogContent from '@/shared/dialogs/StyledDialogContent';

import Typography from '../typography/Typography';
import AddSubscriptionDialogContentFooter from './AddSubscriptionDialogContentFooter';
import AddSubscriptionDialogContentFormWrapper from './AddSubscriptionDialogContentFormWrapper';

export default function AddSubscriptionDialogContent({ children }: { children: ReactNode }) {
  return (
    <StyledDialogContent
      headerTitle="Add Subscription"
      headerDescription={
        <div className="flex w-full flex-row items-center justify-between gap-x-1">
          <div className="flex flex-row items-center justify-start gap-x-1">
            <Typography>Add a new subscription.</Typography>
          </div>
        </div>
      }
    >
      <AddSubscriptionDialogContentFormWrapper>
        { children }
        <AddSubscriptionDialogContentFooter />
      </AddSubscriptionDialogContentFormWrapper>
    </StyledDialogContent>
  );
}
