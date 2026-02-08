import ColumnStack from '@/shared/components/ColumnStack';
import ContentStickyByScrollWrapper from '@/components/layout/ContentStickyByScrollWrapper';

import TopContent from './_components/TopContent';
import ContentParent from './_components/ContentParent';

interface PlaygroundPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function NAvigationPlaygroundPage({}: PlaygroundPageProps) {
  return (
    <ColumnStack>
      <ContentStickyByScrollWrapper threshold={ 120 } hideAnimation="slideUp">
        <ColumnStack className="w-full gap-y-3 py-3">
          <TopContent />
        </ColumnStack>
      </ContentStickyByScrollWrapper>
      <ContentParent className="" items={ MOCK_ITEMS } />
    </ColumnStack>
  );
}

const MOCK_ITEMS: { id: number; name: string }[] = Array.from({ length: 200 }, (_, index) => {
  let chance = Math.random();
  let name = 'small';
  if (chance > 0.3) {
    name = 'medium';
  } else if (chance > 0.6) {
    name = 'large';
  } else {
    name = 'small';
  }
  return {
    id: index + 1,
    name,
  };
});
