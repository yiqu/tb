'use client';

import { ReactNode } from 'react';
import { useQueryState } from 'nuqs';

import { Dialog } from '@/components/ui/dialog';
import StyledDialogContent from '@/shared/dialogs/StyledDialogContent';

type Props = {
  headerTitle: string;
  headerDescription: ReactNode;
  children: ReactNode;
  nuqsQueryParamKey: string;
  showCloseButton?: boolean;
  titleActions?: ReactNode;
};

export default function TableDialogWrapper({
  headerTitle,
  headerDescription,
  nuqsQueryParamKey,
  children,
  showCloseButton,
  titleActions,
}: Props) {
  const [nuqsQueryParamValue, setNuqsQueryParamValue] = useQueryState(nuqsQueryParamKey, {
    scroll: false,
  });

  const handleOnOpenChange = (open: boolean) => {
    if (!open) {
      setNuqsQueryParamValue(null);
    }
  };

  if (!nuqsQueryParamValue) {
    return null;
  }

  return (
    <Dialog open={ !!nuqsQueryParamValue } onOpenChange={ handleOnOpenChange }>
      <StyledDialogContent
        headerTitle={ headerTitle }
        headerDescription={ headerDescription }
        showCloseButton={ showCloseButton }
        titleActions={ titleActions }
      >
        { children }
      </StyledDialogContent>
    </Dialog>
  );
}
