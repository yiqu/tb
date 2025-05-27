import PageLayout2 from '@/shared/PageLayout2';
import ErrorCard from '@/components/status-cards/ErrorCard';
import LayoutWithGutter from '@/components/layout/LayoutWithGutter';
import NoResultsCard from '@/components/status-cards/NoResultsCard';
import PageNotFoundCard from '@/components/status-cards/PageNotFoundCard';

export default function ArtPage() {
  return (
    <PageLayout2>
      <LayoutWithGutter size="wider">
        <div className="flex w-full flex-col items-center justify-start gap-y-2">
          <ErrorCard />
          <ErrorCard blendBg={ true } showTextAreaBorder={ true } />
          <ErrorCard blendBg={ true } blendTextAreaBorder={ true } />
          <NoResultsCard />
          <NoResultsCard blendBg={ true } showTextAreaBorder={ true } />
          <NoResultsCard blendBg={ true } blendTextAreaBorder={ true } />
          <PageNotFoundCard />
          <PageNotFoundCard blendBg={ true } showTextAreaBorder={ true } />
          <PageNotFoundCard blendBg={ true } blendTextAreaBorder={ true } />
        </div>
      </LayoutWithGutter>
    </PageLayout2>
  );
}
