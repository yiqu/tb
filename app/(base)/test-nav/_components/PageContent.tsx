import ColumnStack from '@/shared/components/ColumnStack';
import ContentStickyByScrollWrapper from '@/components/layout/ContentStickyByScrollWrapper';

import { MOCK_ITEMS } from './utils';
import TopContent from './TopContent';
import ContentParent from './ContentParent';

export default function PageContent({ isDialogMode, scrollableContentId }: { isDialogMode?: boolean; scrollableContentId?: string }) {
  return (
    <ColumnStack>
      <ContentStickyByScrollWrapper threshold={ 120 } hideAnimation="slideUp" stickyClassName={ isDialogMode ? 'top-[66px]' : 'top-12' }>
        <ColumnStack className="w-full gap-y-3 py-3">
          <TopContent />
        </ColumnStack>
      </ContentStickyByScrollWrapper>
      <ContentParent className="" items={ MOCK_ITEMS } scrollableContentId={ scrollableContentId } isDialogMode={ isDialogMode } />
    </ColumnStack>
  );
}
