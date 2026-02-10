'use client';

import { ReactNode } from 'react';
import { useQueryState } from 'nuqs';
import { X, Expand } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import RowStack from '@/shared/components/RowStack';
import Typography from '@/components/typography/Typography';
import TableDialogWrapper from '@/shared/table/TableDialogWrapper';

import { SUBSCRIPTION_DETAILS_DIALOG_ID } from './utils';

interface Props {
  children?: ReactNode;
}

export default function SubscriptionDetailsDialogContent({ children }: Props) {
  return (
    <TableDialogWrapper
      headerTitle="Subscription Details"
      headerDescription={ <Typography>Subscription Details</Typography> }
      nuqsQueryParamKey={ SUBSCRIPTION_DETAILS_DIALOG_ID }
      titleActions={ <TitleActions /> }
      showCloseButton={ false }
    >
      { children }
    </TableDialogWrapper>
  );
}

function TitleActions() {
  const [subscriptionDetailsDialogId, setSubscriptionDetailsDialogId] = useQueryState(SUBSCRIPTION_DETAILS_DIALOG_ID);
  const router = useRouter();

  const handleOnCloseDialog = () => {
    setSubscriptionDetailsDialogId(null);
  };

  const handleOnExpandDialog = () => {
    router.replace(`/subscriptions/${subscriptionDetailsDialogId}`, {
      scroll: true,
    });
  };

  return (
    <RowStack>
      <Button variant="ghost" size="icon-sm" type="button" onClick={ handleOnExpandDialog }>
        <Expand />
      </Button>
      <Button variant="ghost" size="icon-sm" type="button" onClick={ handleOnCloseDialog }>
        <X />
      </Button>
    </RowStack>
  );
}
