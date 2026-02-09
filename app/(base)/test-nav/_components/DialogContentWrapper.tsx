import useCurrentInView from '@/hooks/useCurrentInView';
import StyledDialogContent from '@/shared/dialogs/StyledDialogContent';

import PageContent from './PageContent';

export default function DialogContentWrapper({ ids }: { ids: string[] }) {
  return (
    <StyledDialogContent headerTitle="Navigation Playground" id="nav-test-items-scrollable-content">
      <PageContent isDialogMode scrollableContentId="nav-test-items-scrollable-content" />
    </StyledDialogContent>
  );
}
